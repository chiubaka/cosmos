var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;

		_ = require('lodash');

		self.LAYER_BACKGROUND = 10;
		self.LAYER_WORLD = 50;
		self.LAYER_HUD = 90;
		self.DEPTH_PLAYER = 90;

		// set the framerate
		ige.setFps(Constants.fps.SERVER_FPS);

		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.createWorld()
			.box2d.scaleRatio(10)
			.mode(0)//Sets the world interval mode. In mode 0 (zero) the box2d simulation is synced to the framerate of the engine's renderer. In mode 1 the box2d simulation is stepped at a constant speed regardless of the engine's renderer. This must be set *before* calling the start() method in order for the setting to take effect.
			.box2d.start();// this should be the last thing called

		ige.addComponent(IgeMongoDbComponent, DbConfig.config);
		ige.addComponent(IgeNetIoComponent);


		// Add the server-side game methods / event handlers
		this.implement(ServerNetworkEvents);

		// Add server side notification component
		ige.addComponent(NotificationComponent)

		// Define an object to hold references to our player entities
		this.players = {};

		// Connect to MongoDB server
		ige.mongo.connect(function(err,db) {
			// Start the network server on a particular port
			ige.network.start(process.env.PORT || 2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						/* This is called when a player connects to the server and asks for a player object to be made for them */
						ige.network.define('playerEntity', self._onPlayerEntity);
						ige.network.define('playerConnected');
						/* This is called when a player pushes down or releases a key */
						ige.network.define('playerControlUpdate', self._onPlayerControlUpdate);

						/* This is called when a player clicks the respawn button */
						ige.network.define('relocate', self._onRelocateRequest);
						/* This is called when a player clicks the new ship button */
						ige.network.define('new ship', self._onNewShipRequest);

						/* This is called when a player clicks on a block */
						ige.network.define('mineBlock', self._onMineBlock);
						/* This is called when a player clicks on the background. */
						ige.network.define('constructNew', self._onConstructNew);
						/* Called when player clicks on a construction zone */
						ige.network.define('constructionZoneClicked', self._onConstructionZoneClicked);

						/* Define these commands so that we can use them on the client */
						ige.network.define('blockAction');
						ige.network.define('addEffect');
						ige.network.define('removeEffect');

						ige.network.define('cargoRequest', self._onCargoRequest);
						ige.network.define('cargoUpdate');
						ige.network.define('cargoResponse');
						ige.network.define('confirm');

						ige.network.define('shipEntity');

						ige.network.define('cosmos:player.username.set.request', Player.onUsernameRequested);
						ige.network.define('cosmos:player.username.set.approve');
						ige.network.define('cosmos:player.username.set.error');

						/* When a client connects or disconnects */
						ige.network.on('connect', self._onPlayerConnect); // Defined in ./gameClasses/ServerNetworkEvents.js
						ige.network.on('disconnect', self._onPlayerDisconnect); // Defined in ./gameClasses/ServerNetworkEvents.js

						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(Constants.fps.SERVER_FPS)
							.stream.start(); // Start the stream

						// Add crafting system
						ige.addComponent(CraftingSystem);

						// Add quest system
						ige.addComponent(QuestSystem);

						GameInit.init(self);

						// Accept incoming network connections
						ige.network.acceptConnections(true);
					}
				});
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
