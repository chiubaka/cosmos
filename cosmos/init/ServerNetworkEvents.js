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
		// Don't reject the client connection
		return false;
	},

	/**
	A player has disconnected from the server
	This function removes all trace of the player from the 'players' list
	*/
	_onPlayerDisconnect: function(clientId) {
		if (ige.server.players[clientId]) {
			// Handle destroying player state first
			// Unsubscribe players from updates
			ige.server.players[clientId].cargo.unsubscribeFromUpdates(clientId);

			// Remove the player from the game
			ige.server.players[clientId].destroy();

			// Remove the reference to the player entity
			// so that we don't leak memory
			delete ige.server.players[clientId];
		}
	},

	/**
	A player has connected to the server and asked for a player Entity to be created for him or her!
	*/
	_onPlayerEntity: function(data, clientId) {
		if (!ige.server.players[clientId]) {
			ige.server.players[clientId] = new Player(clientId)
				.debugFixtures(false)//call this before calling setGrid()
				.padding(10)
				.grid(ExampleShips.starterShipSingleMisplacedEngine())
				.addSensor(300)
				.attractionStrength(1)
				.streamMode(1)
				.mount(ige.server.spaceGameScene)
				.translateTo((Math.random() - .5) * ige.server.PLAYER_START_DISTANCE, (Math.random() - .5) * ige.server.PLAYER_START_DISTANCE, 0);

			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
		}
	},

	_onRespawnRequest: function(data, clientId) {
		ige.server._onPlayerDisconnect(clientId);
		ige.server._onPlayerEntity(data, clientId);
	},

	/**
	Called when the player updates the state of his control object
	data in this case represents the *new* state of the player's controls
	*/
	_onPlayerControlUpdate: function(data, clientId) {
		ige.server.players[clientId].controls = data;
	},

	// TODO: User access control. Restrict what players can do based on clientId
	// TODO: Guard against undefined blocks (do not trust client) so server doesn't crash
	_onMineBlock: function(data, clientId) {
		var player = ige.server.players[clientId];

		// Do not start mining if we are already mining
		if (player.laserBeam !== undefined) {
			return;
		}

		// TODO: Guard against bogus blockGridId from client
		var blockGrid = ige.$(data.blockGridId);
		data.action = 'mine';
		if(blockGrid.processBlockActionServer(data, player)) {
			// Activate mining laser
			player.addLaser(data.blockGridId, data.row, data.col);
			blockGrid.addMiningParticles(data.blockGridId, data.row, data.col);
		}
	},

	_onConstructNew: function(data, clientId) {
		// TODO: Extract this into a new method and call it with an event emission!
		var player = ige.server.players[clientId];
		var blockToPlace = player.cargo.extractType(data.selectedType)[0];

		if (blockToPlace !== undefined) {
			//console.log("Placing item: " + blockToPlace.classId(), 'info');
			new BlockGrid()
				.category('smallAsteroid')
				.id('littleAsteroid' + Math.random())
				.streamMode(1)
				.mount(ige.$("spaceGameScene"))
				.depth(100)
				.grid([[blockToPlace]])
				.translateTo(data.x, data.y, 0);
		}
	},

	_onCargoRequest: function(data, clientId) {
		var player = ige.server.players[clientId];
		var playerCargo = player.cargo;

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
		//console.log("row: " + data.row + " col: " + data.col);
		var player = ige.server.players[clientId];

		// TODO: This extracts a block from the cargo and throws it away. Should use the result of this in the future!
		var extractedBlocks = player.cargo.extractType(data.selectedType);

		if (extractedBlocks.length > 0) {
			var blockGrid = ige.$(data.blockGridId);
			data.action = 'add';
			blockGrid.processBlockActionServer(data, player);
		}
	}

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
