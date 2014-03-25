var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		ige.showStats(1);
		ige.setFps(60);

		// Load our textures
		var self = this;

		self.LAYER_BACKGROUND = 10;
		self.LAYER_MIDDLE = 50;
		self.LAYER_FOREGROUND = 90;
		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Implement our game methods
		this.implement(ClientNetworkEvents);

		// Add physics and setup physics world
		ige.addComponent(IgeBox2dComponent)
			.box2d.sleep(true)
			.box2d.createWorld()
			.box2d.start();

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		// Load the textures we want to use
		this.textures = {
			block: new IgeTexture(gameRoot + 'assets/BlockTexture.js'),
			background_helix_nebula: new IgeTexture(gameRoot + 'assets/backgrounds/helix_nebula.jpg')
		};

		ige.on('texturesLoaded', function () {
			// Load the SVGs for the block icons from the game server
			self.svgs = {
				power: gameRoot + 'assets/blocks/power/power.svg',
				engine: gameRoot + 'assets/blocks/rocket/rocket.svg',
				fuel: gameRoot + 'assets/blocks/fuel/fuel.svg',
				cargo: gameRoot + 'assets/blocks/cargo/cargo.svg',
				control: gameRoot + 'assets/blocks/playerctrl/playerctrl.svg',
				miningLaser: gameRoot + 'assets/blocks/laser/laser.svg'
			}

			// Loop through the svgs object and request each SVG
			for (var key in self.svgs) {
				if (self.svgs.hasOwnProperty(key)) {
					var url = self.svgs[key];
					var request = new XMLHttpRequest();
					request.onreadystatechange = function() {
						if (request.readyState == 4) {
							if (request.status == 200) {
								// Replace the value in the svgs object with the actual SVG XML data
								self.svgs[key] = request.responseText;
							}
							else {
								console.error("Received status code " + request.status + " when trying to load textures from server.");
							}
						}
					};
					// False here specifies a synchronous request, which simplifies concurrency here.
					// May need to consider changing this if many SVGs need to be downloaded and load
					// times are getting ridiculous.
					request.open('GET', url, false);
					request.send();
				}
			}

			// Ask the engine to start
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?
					ige.network.start('http://localhost:2000', function () {

						// Setup the network command listeners
						ige.network.define('playerEntity', self._onPlayerEntity);

						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80); // Render the simulation 160 milliseconds in the past

						// Ask the server to create an entity for us
						ige.network.send('playerEntity');

						// We don't create any entities here because in this example the entities
						// are created server-side and then streamed to the clients. If an entity
						// is streamed to a client and the client doesn't have the entity in
						// memory, the entity is automatically created. Woohoo!

						// Enable console logging of network messages but only show 10 of them and
						// then stop logging them. This is a demo of how to help you debug network
						// data messages.
						ige.network.debugMax(10);
						ige.network.debug(true);

						GameInit.init(self);
					});
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
