var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		ige.setFps(30);

		// Load our textures
		var self = this;

		self.LAYER_BACKGROUND = 10;
		self.LAYER_PARALLAX = 11;
		self.LAYER_CLICK_SCENE = 15;
		self.LAYER_WORLD = 50;
		self.LAYER_WORLD_OVERLAY = 51;
		self.LAYER_HUD = 90;
		self.LAYER_MODAL = 100;

		// Enable IGE on screen editor
		//ige.addComponent(IgeEditorComponent);

		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Implement our game methods
		this.implement(ClientNetworkEvents);

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		// Load the textures we want to use
		this.textures = {
			block: new IgeTexture(gameRoot + 'assets/BlockTexture.js'),
			glow: new IgeTexture(gameRoot + 'assets/GlowEffectTexture.js'),
			background_helix_nebula: new IgeTexture(gameRoot +
				'assets/backgrounds/helix_nebula.jpg'),
			fixtureDebuggingTexture: new IgeTexture(gameRoot +
				'assets/debug/FixtureDebuggingTexture.js'),
			laserBeamTexture: new IgeTexture(gameRoot +
				'assets/effects/laser/laserbeam.png'),
			rectangleTexture: new IgeTexture(gameRoot +
				'assets/effects/particles/Rectangle.js'),

			// Cap textures
			mineCap_color: new IgeTexture(gameRoot + 'assets/ui/mine/mine-color.png'),
			mineCap_white: new IgeTexture(gameRoot + 'assets/ui/mine/mine-white.png'),
			constructCap_color: new IgeTexture(gameRoot + 'assets/ui/construct/construct-color.png'),
			constructCap_white: new IgeTexture(gameRoot + 'assets/ui/construct/construct-white.png'),
			baseCap_color: new IgeTexture(gameRoot + 'assets/ui/base/base-color.png'),
			baseCap_white: new IgeTexture(gameRoot + 'assets/ui/base/base-white.png')
		};

		ige.on('texturesLoaded', function () {
			// Load the SVGs for the block icons from the game server
			self.svgs = {
				power: gameRoot + 'assets/blocks/power/power.svg',
				engine: gameRoot + 'assets/blocks/rocket/rocket.svg',
				thruster: gameRoot + 'assets/blocks/thruster/thruster.svg',
				fuel: gameRoot + 'assets/blocks/fuel/fuel.svg',
				cargo: gameRoot + 'assets/blocks/cargo/cargo.svg',
				control: gameRoot + 'assets/blocks/playerctrl/playerctrl.svg',
				miningLaser: gameRoot + 'assets/blocks/laser/laser.svg',
				constructionZone: gameRoot +
					'assets/blocks/construction/construction_zone.svg'
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
					ige.client.metrics = new MetricsHandler();
					ige.client.startClientPerformanceMetrics();

					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?

					// Use DeploymentUtils to get the appropriate game server to connect to.
					ige.network.start(DeploymentUtils.getServerUrl(), function() {
						ige.client.metrics.fireEvent('network', 'connect');

						// Setup the network command listeners
						ige.network.define('playerEntity', self._onPlayerEntity);
						// Called when the server needs to broadcast updates about a block
						ige.network.define('blockAction', self._onBlockAction);
						// Called when the server wants to add an effect to a block
						ige.network.define('addEffect', self._onAddEffect);
						// Called when the server wants to remove an effect from a block
						ige.network.define('removeEffect', self._onRemoveEffect);

						ige.network.define('cargoResponse', self._onCargoResponse);
						ige.network.define('cargoUpdate', self._onCargoUpdate);
						ige.network.define('confirm', self._onConfirm);
						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80); // Render the simulation 160 milliseconds in the past

						// Enable notifications
						ige.addComponent(NotificationComponent);
						ige.notification.addComponent(NotificationUIComponent)
							.start();

						// Ask the server to create an entity for us
						ige.network.send('playerEntity', {sid: self.getSessionId()});

						GameInit.init(self);
						//ige.editor.showStats();
					});
				}
			});
		});
	},

	getSessionId: function() {
		var cookie = this.parseCookie();
		var sid = cookie['connect.sid'];

		if (sid === undefined) {
			return undefined;
		}
		// connect.sid comes in the form: s:<id>.<???>+<???>
		return sid.substring(sid.indexOf(':') + 1, sid.indexOf('.'));
	},

	parseCookie: function() {
		var cookieArray = document.cookie.split(';');
		var cookie = {};
		cookieArray.each(function(element) {
			var split = element.split('=');
			cookie[split[0].trim()] = decodeURIComponent(split[1]);
		});

		return cookie;
	},

	/* Send performance metrics to Google analytics */
	startClientPerformanceMetrics: function() {
		setInterval(function() {
			ige.client.metrics.fireEvent('engine', 'performance', 'FPS', ige.fps());
		}, 10000); // Send every 10s
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
