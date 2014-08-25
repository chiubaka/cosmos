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
		player.currentShip().cargo.unsubscribeFromUpdates(clientId);

		var self = this;
		/**
		 * @callback updatePlayerCallback
		 * @param err {Error | null}
		 * @param result {*}
		 */
		DbPlayer.update(player.id(), player, function(err, result) {
			if (err) {
				self.log('Cannot save player in database!', 'error')
			}

			// Remove the player from the game
			player.destroy();
			// Remove the player's ship from the game
			player.currentShip().destroy();

			ige.network.send('playerDisconnected', player.id());

			// Remove the reference to the player entity
			// so that we don't leak memory
			delete ige.server.players[player];
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
			DbPlayer.load(playerId, function(err, username, ship, cargo) {
				if (err) {
					self.log('Cannot load player from database!', 'error');
				}

				ige.server._createPlayer(clientId, playerId, username, ship, cargo);
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
	_createPlayer: function(clientId, playerId, username, ship, cargo) {
		// If the player isn't logged in, give the player a unique id.
		// Otherwise, give the player the saved database id
		var loggedIn;
		if (playerId === undefined) {
			// TODO: Make sure this id doesn't conflict with previous player IDs
			playerId = ige.newIdHex();
			loggedIn = false;
		}
		else {
			loggedIn = true;
		}

		var player = new Player();
		// This player is already logged in and online!
		if (ige.$(playerId)) {
			ige.network.stream.queueCommand('notificationError',
				NotificationDefinitions.errorKeys.alreadyLoggedIn, clientId);
			// TODO: Close this connection.
			return;
		}

		player.id(playerId);
		player.clientId(clientId);
		player.loggedIn(loggedIn);
		player.username(username);

		// If the player doesn't yet have a username, generate a guest username for him
		if (!player.username()) {
			player.generateGuestUsername();
			player.hasGuestUsername = true;
		}
		else {
			player.hasGuestUsername = false;
		}

		ige.server.players[clientId] = player;

		// Load the player's ships
		ige.server._createShip(clientId, playerId, ship, cargo);

		var sendData = player.toJSON();

		// Tell the client to track their player entity
		ige.network.send('playerEntity', sendData, clientId);
		ige.network.send('playerConnected', sendData);

		_.forEach(ige.server.players, function(playerToSend) {
			if (ige.server.players[clientId].id() !== playerToSend.id()) {
				ige.network.send('playerConnected', playerToSend.toJSON(), clientId);
			}
		});
	},

	_createShip: function(clientId, playerId, ship, cargo) {
		player = ige.server.players[clientId];

		player.currentShip(
			new Ship()
				.streamMode(1)
				.mount(ige.$("spaceGameScene"))
		);

		if (ship === undefined) {
			player.currentShip().fromBlockMatrix(ExampleShips.starterShip(), false);
		}
		else {
			player.currentShip().fromBlockTypeMatrix(ship, false);
		}

		player.currentShip().cargo.rehydrateCargo(cargo);

		var sendData = {
			shipId: player.currentShip().id()
		};

		ige.network.send('shipEntity', sendData, clientId);
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

		player.currentShip().relocate();
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

		var playerId = player.id();
		//ige.server._destroyPlayer(clientId, player);
		// We pass no third or fourth argument to _createPlayer() here, which requests a completely new ship
		//ige.server._createPlayer(clientId, playerId, player.username());
		player.currentShip().destroy();
		ige.server._createShip(clientId, playerId);
		ige.network.stream.queueCommand('notificationSuccess',
			NotificationDefinitions.successKeys.newShip, clientId);
	},

	/**
	Called when the player updates the state of his control object.
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

		if (!player.currentShip().canMine()) {
			return;
		}

		// TODO: Guard against bogus blockGridId from client
		var blockGrid = ige.$(data.blockGridId);
		if (blockGrid === undefined) {
			return;
		}

		var targetBlock = blockGrid.get(new IgePoint2d(data.col, data.row))[0];

		// don't let players mine their own bridge block
		if (targetBlock === player.currentShip().bridgeBlocks()[0]) {
			//TODO tell the player that they shouldn't mine their own bridge block
			return;
		}

		data.action = 'mine';
		if(blockGrid.processBlockActionServer(data, player)) {
			player.currentShip().mining = true;

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

			var confirmData = { event:'cosmos:construct.new', data: {'type': data.selectedType} };
			ige.network.send('confirm', confirmData, clientId);
			ige.network.stream.queueCommand('notificationSuccess',
				NotificationDefinitions.successKeys.constructNewBlock, clientId);

			DbPlayer.update(player.id(), player, function() {});
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

			DbPlayer.update(player.id(), player, function() {});
		}
	},

	_onDeconstructionZoneClicked: function(data, clientId) {
		var player = ige.server.players[clientId];
		if (player === undefined) {
			console.log("Cannot deconstruct, player is undefined");
			return;
		}

		var blockGrid = ige.$(data.blockGridId);
		if (blockGrid === player.currentShip()) {
			data.action = 'remove';
			var blocksRemoved = blockGrid.processBlockActionServer(data, player);
			console.log("blocksRemoved:");
			console.log(blocksRemoved);
			console.log("[0]");
			console.log(blocksRemoved[0]);
			console.log("[0].classId()");
			console.log(blocksRemoved[0].classId());
			console.log("done");

			DbPlayer.update(player.id(), player, function() {});

			var extractedBlocks = player.currentShip().cargo.addBlock(blocksRemoved[0].classId());
		} else {
			//TODO make an appropriate alertify error
		}
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
