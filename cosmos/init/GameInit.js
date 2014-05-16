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

		// Disable debug features for more performance
		ige.debugEnabled(false);
		ige.debugTiming(false);

		this.initScenes(game);

		if (ige.isServer) {
			this.initEnvironment();
			this.initPhysics();
			this.initServerEvents();
		} else {
			this.initPlayerState();
			this.initPlayerControls();
			//this.initTimeStream(game);
		}
	},

	/**
	 * Initializes the scene graph for the game. All scenes should be initialized here and both the server and the
	 * client will run this code to construct the same or similar scene graphs. If either the client or the server alone
	 * need to add some element to the scene graph, use ige.isServer.
	 * @param game either ige.client or ige.server
	 */
	initScenes: function(game) {
		// Load the base scene data
		game.mainScene = new IgeScene2d()
			.id('mainScene');

		// Create the main viewport and set the scene it will "look" at as the new scene1 we just created above.
		// Surprisingly, this must exist on both the client and the server, or a blank screen will be displayed.
		game.mainViewport = new IgeViewport()
			.id('mainViewport')
			.autoSize(true)
			.scene(game.mainScene)
			//Note: drawBounds runs on the server for and will slow performance
			.drawBounds(false) //draws the axis aligned bounding boxes. Set to true for debugging.
			.mount(ige);

		// Initialize client-specific overlay scenes
		if (!ige.isServer) {
			// Initialize UI scenes
			this.initUIScenes();

			// Initialize debugging info
			this.initDebugDisplay();
		}

		// Initialize in-game scenes
		this.initInGameScenes(game);
	},

	/**
	 * Initializes the space scene. The space scene is the initial scene of the game, where the player is in space.
	 * It contains three layers for the background, the actual game content, and the UI.
	 * In general, the server needs to know about scenes so that it can attach entities to those scenes and stream them
	 * to the clients. Scenes that are not associated with streamed entities can usually be loaded on just the client.
	 * @param game either ige.client or ige.server
	 */
	initInGameScenes: function(game) {
		game.spaceScene = new IgeScene2d()
			.id('spaceScene')
			.mount(game.mainScene);

		game.spaceGameScene = new IgeScene2d()
			.id('spaceGameScene')
			.layer(game.LAYER_WORLD)
			.mount(game.spaceScene);

		if (!ige.isServer) {
			game.effectsScene = new IgeScene2d()
				.id('effectsScene')
				.layer(game.LAYER_WORLD_OVERLAY)
				.mount(game.spaceScene);

			game.spaceUiScene = new IgeScene2d()
				.id('spaceUiScene')
				.layer(game.LAYER_HUD)
				.ignoreCamera(true)
				.mount(game.spaceScene);

			// This scene's purpose is to catch all clicks on the background
			game.clickScene = new ClickScene()
				.layer(game.LAYER_CLICK_SCENE)
				.mount(game.spaceScene);

			// For now, the server does not need to know about the background scene.
			// The server does not need to load the UI.
			this.initBackgroundScene();

			// Pre-initialize player HUD
			this.initPlayerHUD();
		}
	},

	/**
	 * Initializes the UI scene layer on the client.
	 */
	initUIScenes: function() {
		var client = ige.client;
		client.uiModalScene = new IgeScene2d()
			.id('uiModalScene')
			.layer(client.LAYER_MODAL)
			.ignoreCamera(true)
			.mount(client.mainScene);
	},

	/**
	 * Initializes the HUD scene layer on the client.
	 */
	initPlayerHUD: function() {
		var client = ige.client;
		client.hudScene = new IgeScene2d()
			.id('hudScene')
			.layer(client.LAYER_HUD)
			.ignoreCamera(true)
			.mount(client.spaceScene);

		client.hud = new HUDManager();
	},

	/**
	 * Initializes the environmental background layers on the client.
	 */
	initBackgroundScene: function() {
		var client = ige.client;
		client.spaceBackgroundScene = new IgeScene2d()
				.id('spaceBackgroundScene')
				.layer(client.LAYER_BACKGROUND)
				.mount(client.spaceScene);

		new Background()
			.id('helix_nebula_background')
			.mount(client.spaceBackgroundScene);
	},

	initDebugDisplay: function() {
	},

	/**
	 * Initializes the in-game environment on the server.
	 * TODO: Creating the environment on the client may speed up init time
	 */
	initEnvironment: function() {
		var server = ige.server;

		var NUM_NORMAL_ASTEROIDS = 20;
		for (var asteroidNumber = 0; asteroidNumber < NUM_NORMAL_ASTEROIDS; asteroidNumber++) {
			var asteroid = new BlockGrid()
				.id('genRandomAsteroid' + asteroidNumber)
				.streamMode(1)
				.mount(server.spaceGameScene)
				.padding(10)
				.grid(AsteroidGenerator.genProceduralAsteroid(20))
			this.moveRandomly(asteroid);
		}

		var NUM_SMALL_ASTEROIDS = 80;
		for (var asteroidNumber = 0; asteroidNumber < NUM_SMALL_ASTEROIDS; asteroidNumber++) {
			var asteroid = new BlockGrid()
				.category('smallAsteroid')
				.id('littleAsteroid' + asteroidNumber)
				.streamMode(1)
				.mount(server.spaceGameScene)
				.padding(1)
				.grid(AsteroidGenerator.singleBlock());
			this.moveRandomly(asteroid);
		}

		var NUM_DERELICT_SPACESHIPS = 10;
		for (var asteroidNumber = 0; asteroidNumber < NUM_DERELICT_SPACESHIPS; asteroidNumber++) {
			var asteroid = new BlockGrid()
				.id('spaceShip' + asteroidNumber)
				.streamMode(1)
				.mount(server.spaceGameScene)
				.padding(10)
				//note that the signature of gen.. is genProceduralAsteroid: function(maxSize, maxNumBlocks, blockDistribution)
				.grid(AsteroidGenerator.genProceduralAsteroid(20, 20, AsteroidGenerator.blockDistributions.SHIP_PARTS, true));
			this.moveRandomly(asteroid);
		}
	},

	/**
	 * Initializes the physics on the server.
	 * TODO: Running physics on the client may improve performance.
	 */
	initPhysics: function() {
		// Set the contact listener methods to detect when
		// contacts (collisions) begin and end
		ige.box2d.contactListener(
			// Listen for when contact's begin
			function(contact) {
				// If player ship is near small asteroids, attract them
				if (contact.igeEitherCategory('player') &&
					contact.igeEitherCategory('smallAsteroid')) {
					var asteroid = contact.igeEntityByCategory('smallAsteroid');
					var player = contact.igeEntityByCategory('player');

					// TODO: Make it so blocks are attracted to multiple players
					if (asteroid.attractedTo === undefined) {
						asteroid.attractedTo = player;
					}
				}
			},
			// Listen for when contacts end
			function(contact) {
				if (contact.igeEitherCategory('player') &&
					contact.igeEitherCategory('smallAsteroid')) {
					var asteroid = contact.igeEntityByCategory('smallAsteroid');
					asteroid.attractedTo = undefined;
				}
			},
			// Presolve events. This is called after collision is detected, but
			// before collision repsonse is calculated.
			function(contact) {
				if (contact.igeEitherCategory('player') &&
					contact.igeEitherCategory('smallAsteroid')) {
					var asteroid = contact.igeEntityByCategory('smallAsteroid');
					var player = contact.igeEntityByCategory('player');
					var shipFixture = contact.fixtureByCategory('player');

					// Asteroid has hit ship blocks, destroy the asteroid
					if (!shipFixture.m_isSensor) {
						// Disable contact so player doesn't move due to collision
						contact.SetEnabled(false);
						// Ignore multiple collision points
						if (asteroid === undefined || !asteroid.alive()) {
							return;
						}
						ige.emit('block collected',
							[player, BlockGridPadding.extract1x1(asteroid.grid()).classId()]);
						asteroid.destroy();
					}
				}
			});
	},

	initServerEvents: function() {
		// Register game event listeners
		ige.on('block mined', Player.prototype.blockMinedListener);
		ige.on('block mined', BlockGrid.prototype.blockMinedListener);
		ige.on('block collected', Player.prototype.blockCollectListener);
	},

	initClientEvents: function() {

	},

	/**
	 * Sets up the player controls.
	 * @param client the client (ige.client)
	 */
	initPlayerControls: function() {
		// Define our player controls
		ige.input.mapAction('key.left', ige.input.key.left);
		ige.input.mapAction('key.right', ige.input.key.right);
		ige.input.mapAction('key.up', ige.input.key.up);
		ige.input.mapAction('key.down', ige.input.key.down);

		// Alternate WASD controls
		ige.input.mapAction('key.left_A', ige.input.key.a);
		ige.input.mapAction('key.right_D', ige.input.key.d);
		ige.input.mapAction('key.up_W', ige.input.key.w);
		ige.input.mapAction('key.down_S', ige.input.key.s);

		ige.input.mapAction('mouse.button1', ige.input.mouse.button1);
		ige.input.mapAction('mouse.button2', ige.input.mouse.button2);
		ige.input.mapAction('mouse.button3', ige.input.mouse.button3);
	},

	initPlayerState: function() {
		ige.client.state = new ClientState();
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
			.mount(client.uiModalScene);

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

	moveRandomly: function(entity) {
		//this is the maximum distance that we will translate entities to
		var MAX_DISTANCE = 6000;
		entity.translateTo((Math.random() - .5) * MAX_DISTANCE, (Math.random() - .5) * MAX_DISTANCE, 0);
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = GameInit; }
