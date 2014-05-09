var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;

		self.LAYER_BACKGROUND = 10;
		self.LAYER_WORLD = 50;
		self.LAYER_HUD = 90;
		self.DEPTH_PLAYER = 90;

		// Load our blocks
		self.obj = [];

		// set the framerate
		ige.setFps(60);

		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.createWorld()
			.box2d.scaleRatio(10)
			.mode(1)//Sets the world interval mode. In mode 0 (zero) the box2d simulation is synced to the framerate of the engine's renderer. In mode 1 the box2d simulation is stepped at a constant speed regardless of the engine's renderer. This must be set *before* calling the start() method in order for the setting to take effect.
			.box2d.start();// this should be the last thing called

    // Add the server-side game methods / event handlers
		this.implement(ServerNetworkEvents);

		// Define an object to hold references to our player entities
		this.players = {};

		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server on a particular port
			.network.start(process.env.PORT || 2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						/* Called when a player connects to the server and asks for a player object to be made for them */
						ige.network.define('playerEntity', self._onPlayerEntity);
						/* Called when a player pushes down or releases a key */
						ige.network.define('playerControlUpdate', self._onPlayerControlUpdate);

						/* Called when a player clicks on a block */
						ige.network.define('blockClicked', self._onBlockClicked);
						/* Called when a player clicks on the background. */
						ige.network.define('backgroundClicked', self._onBackgroundClicked);
						/* Called when player clicks on a construction zone */
						ige.network.define('constructionZoneClicked', self._onConstructionZoneClicked);
						/* Define this command so that we can use it on the client */
						ige.network.define('blockAction');

						/* When a client connects or disconnects */
						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js

						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);

						GameInit.init(self);
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
