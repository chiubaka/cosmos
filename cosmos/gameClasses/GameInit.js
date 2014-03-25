var GameInit = {
	init: function(game) {
		// Load the base scene data
		game.mainScene = new IgeScene2d()
			.id('mainScene');

		// Create the main viewport and set the scene
		// it will "look" at as the new scene1 we just
		// created above
		game.vp1 = new IgeViewport()
			.id('vp1')
			.autoSize(true)
			.scene(game.mainScene)
			.drawBounds(false)
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

	initScenes: function(game) {
		this.initSpaceScene(game);
	},

	initSpaceScene: function(game) {
		game.spaceScene = new IgeScene2d()
			.id('spaceScene')
			.mount(game.mainScene);

		game.spaceGameScene = new IgeScene2d()
			.id('spaceGameScene')
			.layer(game.LAYER_MIDDLE)
			.mount(game.spaceScene);

		if (!ige.isServer) {
			game.spaceBackgroundScene = new IgeScene2d()
				.id('spaceBackgroundScene')
				.layer(game.LAYER_BACKGROUND)
				.mount(game.spaceScene);

			game.spaceUiScene = new IgeScene2d()
				.id('spaceUiScene')
				.ignoreCamera(true)
				.mount(game.spaceScene);
		}
	},

	sharedInit: function(game) {
	},

	clientInit: function(client) {
		this.initPlayerControls(client);

		new Background()
			.id('helix_nebula_background')
			.mount(client.spaceBackgroundScene);

		this.initTimeStream(client);
	},

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

	serverInit: function(server) {
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
