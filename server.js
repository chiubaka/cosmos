var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;

		self.LAYER_BACKGROUND = 10;
		self.LAYER_MIDDLE = 50;
		self.LAYER_FOREGROUND = 90;
		self.DEPTH_PLAYER = 90;
		
		// Load our blocks
		self.obj = [];

		ige.setFps(60);
		
		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.createWorld()
			.box2d.start();

    	
    	// Add the server-side game methods / event handlers
		this.implement(ServerNetworkEvents);


		// Define an object to hold references to our player entities
		this.players = {};


		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						ige.network.define('playerEntity', self._onPlayerEntity);

						ige.network.define('playerControlLeftDown', self._onPlayerLeftDown);
						ige.network.define('playerControlRightDown', self._onPlayerRightDown);
						ige.network.define('playerControlThrustDown', self._onPlayerThrustDown);

						ige.network.define('playerControlLeftUp', self._onPlayerLeftUp);
						ige.network.define('playerControlRightUp', self._onPlayerRightUp);
						ige.network.define('playerControlThrustUp', self._onPlayerThrustUp);

						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js
			
						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);

						// Load the base scene data, this creates a 2d scene and a
						// viewport, vp1
						//ige.addGraph('IgeBaseScene');

						self.mainScene = new IgeScene2d()
							.id('mainScene');

						self.backgroundScene = new IgeScene2d()
							.id('backgroundScene')
							.layer(self.LAYER_BACKGROUND)
							.mount(self.mainScene);
						
						self.foregroundScene = new IgeScene2d()
							.id('foregroundScene')
							.layer(self.LAYER_FOREGROUND)
							.mount(self.mainScene);

						// Create the main viewport and set the scene
						// it will "look" at as the new scene1 we just
						// created above
						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(true)
							.mount(ige);

						new Background()
							.id('helix_nebula_background')
							.streamMode(1)
							.mount(self.backgroundScene)
					
						new Block()
							.id('block1')
							.streamMode(1)
							.mount(self.foregroundScene)
							.depth(100)

						new BlockGrid([[new Block()],[new Block()]])
							.id('blockGrid1')
							.streamMode(1)
							.mount(self.foregroundScene)
							.depth(100)

			
						new IgeEntityBox2d()
						.box2dBody({
							type: 'dynamic',
							linearDamping: 0.0,
							angularDamping: 0.1,
							allowSleep: true,
							bullet: false,
							gravitic: true,
							fixedRotation: false,
							fixtures: [{
								density: 1.0,
								friction: 0.5,
								restitution: 0.5,
								shape: {
									type: 'circle',
									data: {
										// The position of the fixture relative to the body
										x: 0,
										y: 0
									}
								}
							}]
						})
					.id('ball1')
					.translateTo(4, -300, 0)
					.drawBounds(true)
					.mount(self.foregroundScene)
					.streamMode(1);


					// Add the box2d debug painter entity to the
					// scene to show the box2d body outlines

					//ige.box2d.enableDebug(self.foregroundScene);


					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
