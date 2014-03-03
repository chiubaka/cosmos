var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
	
		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.createWorld()
			.box2d.start();

    // Add the server-side game methods / event handlers
		this.implement(ServerNetworkEvents);
		

		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						ige.network.on('connect', function () {});
						ige.network.on('disconnect', function () {});
 
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

						// Load the base scene data
						ige.addGraph('IgeBaseScene');
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
