var ServerNetworkEvents = {
	/**
	 * Is called when the network tells us a new client has connected
	 * to the server. This is the point we can return true to reject
	 * the client connection if we wanted to.
	 * @param data The data object that contains any data sent from the client.
	 * @param clientId The client id of the client that sent the message.
	 * @private
	 */
	_onPlayerConnect: function(socket) {
		// TODO: Reject the client connection if this is the same player connecting
		// more than once.

		// Don't reject the client connection
		return false;
	},

	/**
	 * Called when a player disconnects from the game. Makes sure to save the player's state in the database if the
	 * player is logged in.
	 * @param clientId ID of the client that disconnected from the game.
	 * @private
	 */
	_onPlayerDisconnect: function(clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		ige.server._destroyPlayer(clientId, player);
		delete player;
	},

	/**
	 * Destroys the state for the player with the associated client ID. Saves this state in the database if the player
	 * is logged in.
	 * @param clientId ID of the client whose player to destroy.
	 * @private
	 */
	_destroyPlayer: function(clientId, player) {
		// Handle destroying player state first
		// Unsubscribe players from updates
		player.cargo.unsubscribeFromUpdates(clientId);

		var self = this;
		/**
		 * @callback updatePlayerCallback
		 * @param err {Error | null}
		 * @param result {*}
		 */
		DbPlayer.update(player.dbId(), player, function(err, result) {
			if (err) {
				self.log('Cannot save player in database!', 'error')
			}

			// Remove the player from the game
			player.destroy();

			// Remove the reference to the player entity
			// so that we don't leak memory
			delete player;
		});
	},

	/**
	 * Called when a new player entity is required. Registered on the "playerEntity" network command, but also called
	 * when trying to generate a newShip.
	 * @param data Data sent by the client.
	 * @param clientId ID of the client that triggered this network event.
	 * @param newShip True when we should force creation of a new ship. This will be the case when the new ship button
	 * is pressed.
	 * @private
	 */
	_onPlayerEntity: function(data, clientId) {
		var self = this;
		/**
		 * @callback onPlayerEntitySessionCallback
		 * @param err {Error | null}
		 * @param playerId {String} A unique player identifier.
		 */
		DbSession.playerIdForSession(data.sid, function(err, playerId) {
			if (err) {
				self.log('Cannot load session from database!', 'error');
			}
			// No player associated with this session! Playing as a guest.
			else if (playerId === undefined) {

			}

			/**
			 * @callback onPlayerEntityLoadCallback
			 * @param err {Error | null}
			 * @param ship {Array} Player's ship, represented as a 2D array
			 * @param cargo {Array} Player's cargo
			 */
			DbPlayer.load(playerId, function(err, ship, cargo) {
				if (err) {
					self.log('Cannot load player from database!', 'error')
				}

				ige.server._createPlayer(clientId, playerId, ship, cargo);
			});
		});
	},

	/**
	 * Creates a new player ship and streams it to the client
	 * @param clientId ID of the client to send the ship to
	 * @param playerId Database ID of this player
	 * @param ship The ship to use to create this ship. If none is specified, the starter ship will be used.
	 * @param cargo The cargo to give the player. If none is specified, the player will be given an empty cargo.
	 * @private
	 */
	_createPlayer: function(clientId, playerId, ship, cargo) {
		var player = new Player()
			.clientId(clientId)
			.mount(ige.server.spaceGameScene)
			.streamMode(1);

			// Call BlockGrid#debugFixtures before calling BlockGrid#fromBlockMatrix, since debugging entities are
			// added when fixtures are added.

		if (ship === undefined) {
			player.fromBlockMatrix(ExampleShips.starterShip(), false);
		}
		else {
			player.fromBlockTypeMatrix(ship, false);
		}

		if (playerId !== undefined) {
			player.dbId(playerId);
		}

		//	player.cargo.rehydrateCargo(cargo);

		ige.server.players[clientId] = player;

		var sendData = {
			entityId: ige.server.players[clientId].id(),
			playerId: playerId !== undefined ? playerId : "undefined"
		};

		console.log("entityId: " + sendData.entityId);

		// Tell the client to track their player entity
		ige.network.send('playerEntity', sendData, clientId);
	},

	/**
	 * Called in response to a "relocate" network command. Relocates the player to a new, randomized location.
	 * @param data Data object sent by the client.
	 * @param clientId ID of the client that sent the network command.
	 * @private
	 */
	_onRelocateRequest: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		player.relocate();
		ige.network.stream.queueCommand('notificationSuccess',
			NotificationDefinitions.successKeys.relocateShip, clientId);
	},

	/**
	 * Called when the "new ship" network command is received. Generates a new starter ship for the player.
	 * @param data The data object sent by the client.
	 * @param clientId ID of the client that sent the network command.
	 * @private
	 */
	_onNewShipRequest: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		var playerId = player.dbId();
		ige.server._destroyPlayer(clientId, player);
		// We pass no third or fourth argument to _createPlayer() here, which requests a completely new ship
		ige.server._createPlayer(clientId, playerId);
		ige.network.stream.queueCommand('notificationSuccess',
			NotificationDefinitions.successKeys.newShip, clientId);
	},

	/**
	Called when the player updates the state of his control object
	data in this case represents the *new* state of the player's controls
	*/
	_onPlayerControlUpdate: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		player.controls(data);
	},

	// TODO: User access control. Restrict what players can do based on clientId
	// TODO: Guard against undefined blocks (do not trust client) so server doesn't crash
	_onMineBlock: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		// TODO: Guard against bogus blockGridId from client
		var blockGrid = ige.$(data.blockGridId);
		if (blockGrid === undefined) {
			return;
		}

		if (!player.currentShip().canMine()) {
			return;
		}

		data.action = 'mine';
		if(blockGrid.processBlockActionServer(data, player)) {
			player.currentShip().mining = true;

			var targetBlock = blockGrid.get(data.row, data.col);
			// Activate mining lasers
			player.currentShip().fireMiningLasers(targetBlock);
		}
	},

	_onConstructNew: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		// TODO: Extract this into a new method and call it with an event emission!
		var blockToPlace = player.currentShip().cargo.extractType(data.selectedType)[0];

		if (blockToPlace !== undefined) {
			//console.log("Placing item: " + blockToPlace.classId(), 'info');
			new BlockStructure()
				.streamMode(1)
				.mount(ige.$("spaceGameScene"))
				.depth(100)
				.fromBlockMatrix([[blockToPlace]])
				.translateTo(data.x, data.y, 0);

			var confirmData = { category: 'construct', action: 'new', label: data.selectedType };
			ige.network.send('confirm', confirmData, clientId);
			ige.network.stream.queueCommand('notificationSuccess',
				NotificationDefinitions.successKeys.constructNewBlock, clientId);
		}
	},

	_onCargoRequest: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		var playerCargo = player.currentShip().cargo;

		if (data !== undefined && data !== null) {
			if (data.requestUpdates) {
				playerCargo.subscribeToUpdates(clientId);
			} else {
				playerCargo.unsubscribeFromUpdates(clientId);
			}
		}

		ige.network.send('cargoResponse', playerCargo.getItemList(true), clientId);
	},

	// TODO: Verify valid construction zone
	_onConstructionZoneClicked: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			return;
		}

		// TODO: This extracts a block from the cargo and throws it away. Should use the result of this in the future!
		var extractedBlocks = player.currentShip().cargo.extractType(data.selectedType);

		if (extractedBlocks.length > 0) {
			var blockGrid = ige.$(data.blockGridId);
			data.action = 'add';
			blockGrid.processBlockActionServer(data, player);
		}
	}

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
