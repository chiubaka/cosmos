/**
 * This file contains functions important for game initialization. A lot of game initialization code is shared between
 * the client and the server, so we've moved that code here to avoid code duplication.
 * @type {{init: init, initScenes: initScenes, initSpaceScene: initSpaceScene, sharedInit: sharedInit, clientInit: clientInit, initPlayerControls: initPlayerControls, initTimeStream: initTimeStream, serverInit: serverInit}}
 */
var GameInit = {
	/**
	 * This is the function to call to initialize the game. It must be called on both the client and the server after
	 * the networking has been setup.
	 * @param game either ige.client or ige.server
	 */
	init: function(game) {
		// Load the base scene data
		game.mainScene = new IgeScene2d()
			.id('mainScene');

		// Create the main viewport and set the scene it will "look" at as the new scene1 we just created above.
		// Surprisingly, this must exist on both the client and the server, or a blank screen will be displayed.
		game.vp1 = new IgeViewport()
			.id('vp1')
			.autoSize(true)
			.scene(game.mainScene)
			.drawBounds(false) //draws the axis aligned bounding boxes. Set to true for debugging.
			.mount(ige);

		this.initScenes(game);
		this.sharedInit(game);

		if (ige.isServer) {
			this.serverInit(game);
		}
		else {
			this.clientInit(game);
		}
	},

	/**
	 * Initializes the scene graph for the game. All scenes should be initialized here and both the server and the
	 * client will run this code to construct the same or similar scene graphs. If either the client or the server alone
	 * need to add some element to the scene graph, use ige.isServer.
	 * @param game either ige.client or ige.server
	 */
	initScenes: function(game) {
		this.initSpaceScene(game);
	},

	/**
	 * Initializes the space scene. The space scene is the initial scene of the game, where the player is in space.
	 * It contains three layers for the background, the actual game content, and the UI.
	 * In general, the server needs to know about scenes so that it can attach entities to those scenes and stream them
	 * to the clients. Scenes that are not associated with streamed entities can usually be loaded on just the client.
	 * @param game either ige.client or ige.server
	 */
	initSpaceScene: function(game) {
		game.spaceScene = new IgeScene2d()
			.id('spaceScene')
			.mount(game.mainScene);

		game.spaceGameScene = new IgeScene2d()
			.id('spaceGameScene')
			.layer(game.LAYER_MIDDLE)
			.mount(game.spaceScene);

		// For now, the server does not need to know about the background scene.
		// The server does not need to load the UI.
		if (!ige.isServer) {
			game.spaceBackgroundScene = new IgeScene2d()
				.id('spaceBackgroundScene')
				.layer(game.LAYER_BACKGROUND)
				.mount(game.spaceScene);

			game.spaceUiScene = new IgeScene2d()
				.id('spaceUiScene')
				.layer(game.LAYER_FOREGROUND)
				.ignoreCamera(true)
				.mount(game.spaceScene);
		}
	},

	/**
	 * Shared initialization code goes here.
	 * @param game either ige.client or ige.server
	 */
	sharedInit: function(game) {
	},

	/**
	 * Client only initialization. Will not be run by the server.
	 * @param client the client (ige.client)
	 */
	clientInit: function(client) {
		this.initPlayerControls(client);

		new Background()
			.id('helix_nebula_background')
			.mount(client.spaceBackgroundScene);

		this.initTimeStream(client);
	},

	/**
	 * Sets up the player controls.
	 * @param client the client (ige.client)
	 */
	initPlayerControls: function(client) {
		// Define our player controls
		ige.input.mapAction('key.left', ige.input.key.left);
		ige.input.mapAction('key.right', ige.input.key.right);
		ige.input.mapAction('key.up', ige.input.key.up);
		ige.input.mapAction('key.down', ige.input.key.down);

		ige.input.mapAction('mouse.button1', ige.input.mouse.button1);
		ige.input.mapAction('mouse.button2', ige.input.mouse.button2);
		ige.input.mapAction('mouse.button3', ige.input.mouse.button3);
	},

	/**
	 * Initializes the time stream UI element for debugging.
	 * @param client the client (ige.client)
	 */
	initTimeStream: function(client) {
		// Create an IgeUiTimeStream entity that will allow us to "visualise" the
		// timestream data being interpolated by the player entity
		client.tsVis = new IgeUiTimeStream()
			.height(140)
			.width(400)
			.top(0)
			.center(0)
			.mount(client.spaceUiScene);

		client.custom1 = {
			name: 'Delta',
			value: 0
		};

		client.custom2 = {
			name: 'Data Delta',
			value: 0
		};

		client.custom3 = {
			name: 'Offset Delta',
			value: 0
		};

		client.custom4 = {
			name: 'Interpolate Time',
			value: 0
		};

		ige.watchStart(client.custom1);
		ige.watchStart(client.custom2);
		ige.watchStart(client.custom3);
		ige.watchStart(client.custom4);
	},

	/**
	 * Server only initialization. Will not be run by the client.
	 * @param server the server (ige.server)
	 */
	serverInit: function(server) {

		// The server streams these entities to the client. Creating them on both the client AND the server may speed
		// up initialization time.
		new BlockGrid()
			.id('blockGrid1')
			.streamMode(1)
			.mount(server.spaceGameScene)
			.depth(100)
			.setGrid([[new EngineBlock(), new EngineBlock(), new EngineBlock(), new EngineBlock(), new EngineBlock(), new EngineBlock()], [new EngineBlock(), new EngineBlock()]]);

		new BlockGrid()
			.id('blockGrid2')
			.streamMode(1)
			.mount(server.spaceGameScene)
			.depth(100)
			.setGrid(BlockGrid.prototype.newGridFromDimensions(30, 10));
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameInit; }