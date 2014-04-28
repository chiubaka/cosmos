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
				.grid(ExampleShips.starterShipSingleMisplacedEngine())
				.addSensor(300)
				.attractionStrength(1)
				.streamMode(1)
				.mount(ige.server.spaceGameScene);

			// Tell the client to track their player entity
			ige.network.send('playerEntity', ige.server.players[clientId].id(), clientId);
		}
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
	_onBlockClicked: function(data, clientId) {

		var player = ige.server.players[clientId];

		// Do not start mining if we are already mining
		if (player.laserBeam !== undefined) {
			return;
		}

		var blockGrid = ige.$(data.blockGridId);
		data.action = 'mine';
		blockGrid.processBlockActionServer(data, player);

		ige.network.send('blockAction', data);

		// Activate mining laser
		player.addLaser();
	},

	_onBackgroundClicked: function(data, clientId) {
		new BlockGrid()
			.category('smallAsteroid')
			.id('littleAsteroid' + Math.random())
			.streamMode(1)
			.mount(game.spaceGameScene)
			.depth(100)
			.grid(AsteroidGenerator.singleBlock())
			.translateTo(data.x, data.y, 0);
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
