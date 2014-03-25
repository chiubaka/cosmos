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
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());
							});

						// Define our player controls
						ige.input.mapAction('key.left', ige.input.key.left);
						ige.input.mapAction('key.right', ige.input.key.right);
						ige.input.mapAction('key.up', ige.input.key.up);
						ige.input.mapAction('key.down', ige.input.key.down);

						ige.input.mapAction('mouse.button1', ige.input.mouse.button1);
						ige.input.mapAction('mouse.button2', ige.input.mouse.button2);
						ige.input.mapAction('mouse.button3', ige.input.mouse.button3);

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

						// Load the base scene data
						self.mainScene = new IgeScene2d()
							.id('mainScene');

						self.backgroundScene = new IgeScene2d()
							.id('backgroundScene')
							.layer(self.LAYER_BACKGROUND)
							.mount(self.mainScene);

						self.gameScene = new IgeScene2d()
							.id('gameScene')
							.layer(self.LAYER_MIDDLE)
							.mount(self.mainScene);

						// Create the main viewport and set the scene
						// it will "look" at as the new scene1 we just
						// created above
						self.vp1 = new IgeViewport()
							.id('vp1')
							.autoSize(true)
							.scene(self.mainScene)
							.drawBounds(false)
							.width(10)
							.mount(ige);

						self.uiScene = new IgeScene2d()
							.id('uiScene')
							.ignoreCamera(true)
							.layer(self.LAYER_FOREGROUND)
							.mount(self.mainScene);

						new EngineBlock()
							.mount(self.uiScene);

						self.minimapViewport = new IgeViewport()
							.id('minimapViewport')
							.autoSize(false)
							.scene(self.mainScene)
							.drawBounds(false)
							.mount(ige);

						// Create an IgeUiTimeStream entity that will allow us to "visualise" the
						// timestream data being interpolated by the player entity
						self.tsVis = new IgeUiTimeStream()
							.height(140)
							.width(400)
							.top(0)
							.center(0)
							.mount(self.uiScene);

						self.custom1 = {
							name: 'Delta',
							value: 0
						};

						self.custom2 = {
							name: 'Data Delta',
							value: 0
						};

						self.custom3 = {
							name: 'Offset Delta',
							value: 0
						};

						self.custom4 = {
							name: 'Interpolate Time',
							value: 0
						};

						ige.watchStart(self.custom1);
						ige.watchStart(self.custom2);
						ige.watchStart(self.custom3);
						ige.watchStart(self.custom4);
					});
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
