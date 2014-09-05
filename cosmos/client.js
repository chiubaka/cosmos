var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		window.addEventListener("keydown", function(e) {
			// space and arrow keys
			if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();
			}
		}, false);

		var self = this;
		window.onerror = function(message, url, lineNumber) {
			self.onLoadError(message);
			return false;
		};

		ige.setFps(Constants.fps.CLIENT_FPS);

		// Load our textures
		var self = this;

		self.LAYER_BACKGROUND = 10;
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

		// IGE rendering system is left attached in order to support the textures system which, for now, is still used
		// for displaying blocks in canvases in the HUD.
		ige.addSystem(IgeRenderingSystem, {autoSize: true});

		ige.addSystem(PixiRenderingSystem, {autoSize: true});

		// Load textures
		var textures = {};
		textures.background_starfield = 'assets/backgrounds/starfield.png'

		for (var gridX = 0; gridX < Constants.NUM_BACKGROUND_SQUARES.X; gridX++) {
			for (var gridY = 0; gridY < Constants.NUM_BACKGROUND_SQUARES.Y; gridY++) {
				textures['background' + gridX + '-' + gridY] = 'assets/backgrounds/background' + gridX + '-' + gridY + '.jpg';
			}
		}
		textures['backgroundOverlay'] = 'assets/backgrounds/backgroundOverlay.png';

		ige.rendering.loadTextures(textures);
		ige.rendering.loadSpriteSheets(['assets/blocks/spritesheet.json']);
		ige.rendering.start();

		ige.rendering.on('texturesLoaded', function() {

			ige.rendering.log('Finished Pixi loading textures.');

			// Load the textures we want to use
			var textures = {
				block: new IgeTexture('assets/BlockTexture.js'),
				glow: new IgeTexture('assets/GlowEffectTexture.js'),
				background_helix_nebula: new IgeTexture(
					'assets/backgrounds/helix_nebula.jpg'),
				background_starfield: new IgeTexture(
					'assets/backgrounds/starfield.png'),
				fixtureDebuggingTexture: new IgeTexture(
					'assets/debug/FixtureDebuggingTexture.js'),
				laserBeamTexture: new IgeTexture(
					'assets/effects/laser/laserbeam.png'),
				rectangleTexture: new IgeTexture(
					'assets/effects/particles/Rectangle.js'),
				healthBar: new IgeTexture('assets/HealthBarTexture.js'),

				// Cap textures
				mineCap_color: new IgeTexture('assets/ui/mine/mine-color.png'),
				mineCap_white: new IgeTexture('assets/ui/mine/mine-white.png'),
				constructCap_color: new IgeTexture('assets/ui/construct/construct-color.png'),
				constructCap_white: new IgeTexture('assets/ui/construct/construct-white.png'),
				baseCap_color: new IgeTexture('assets/ui/base/base-color.png'),
				baseCap_white: new IgeTexture('assets/ui/base/base-white.png'),

				// Block textures
				constructionZone: new IgeTexture(
					'assets/blocks/construction/construction_zone.svg'),
				power: new IgeTexture(
					'assets/blocks/power/power.svg'),
				engine: new IgeTexture(
					'assets/blocks/engines/engine.svg'),
				thruster: new IgeTexture(
					'assets/blocks/thrusters/thruster.svg'),
				kryptoniteThruster: new IgeTexture(
					'assets/blocks/thrusters/kryptoniteThruster.svg'),
				fuel: new IgeTexture(
					'assets/blocks/fuel/fuel.svg'),
				cargo: new IgeTexture(
					'assets/blocks/cargo/cargo.svg'),
				control: new IgeTexture(
					'assets/blocks/playerctrl/playerctrl.svg'),
				miningLaser: new IgeTexture(
					'assets/blocks/laser/laser.svg'),
				plating: new IgeTexture(
					'assets/blocks/armor/plating.svg')
			}

			for (var gridX = 0; gridX < Constants.NUM_BACKGROUND_SQUARES.X; gridX++) {
				for (var gridY = 0; gridY < Constants.NUM_BACKGROUND_SQUARES.Y; gridY++) {
					textures['background' + gridX + '-' + gridY] = new IgeTexture('assets/backgrounds/background' + gridX + '-' + gridY + '.jpg');
				}
			}
			textures['backgroundOverlay'] = new IgeTexture('assets/backgrounds/backgroundOverlay.png');

			self.textures = textures;

			ige.on('texturesLoaded', function () {
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

						// Read the game server url injected by the cosmos.jade file
						ige.network.start(window.config.gameServerUrl, function () {
							ige.client.metrics.track('cosmos:network.connect');

							// Setup the network command listeners
							ige.network.define('playerEntity', self._onPlayerEntity);
							ige.network.define('playerConnected', self._onPlayerConnected);
							ige.network.define('playerDisconnected', self._onPlayerDisconnected);
							ige.network.define('shipEntity', self._onShipEntity);

							// Called when the server wants to add an effect to a block
							ige.network.define('addEffect', self._onAddEffect);
							// Called when the server wants to remove an effect from a block
							ige.network.define('removeEffect', self._onRemoveEffect);

							ige.network.define('cargoResponse', self._onCargoResponse);
							ige.network.define('cargoUpdate', self._onCargoUpdate);
							ige.network.define('confirm', self._onConfirm);

							ige.network.define('cosmos:player.username.set.approve', Player.onUsernameRequestApproved);
							ige.network.define('cosmos:player.username.set.error', Player.onUsernameRequestError);

							ige.network.define('cosmos:ship.death', self._onShipDeath);

							// Setup the network stream handler
							ige.network.addComponent(IgeStreamComponent)
								.stream.renderLatency(100); // Render the simulation 100 milliseconds in the past

							// Enable notifications
							ige.addComponent(NotificationComponent);
							ige.notification.start();

							// Enable crafting system
							ige.addComponent(CraftingSystem);

							// Enable quest system
							ige.addComponent(QuestSystem);

							GameInit.init(self);

							//ige.editor.showStats();

							ige.addComponent(HUDComponent);
							// Wait until the HUD finishes loading to ask for the player.
							ige.on('cosmos:hud.loaded', function (hud) {
								ige.hud.log('HUD Loaded.');
								$('#ready').show();
								$('.igeLoading.loadingFloat.preview').hide();

								$('#ready button').click(function() {
									self.takeFullscreen();
									window.onerror = undefined;
									$('.igeLoading').hide();
									// Ask the server to create an entity for us
									ige.network.send('playerEntity', {sid: self.getSessionId()});
								});
							});
						});
					}
				});
			});
		});
	},

	onFullscreenChange: function() {
		ige.hud.hide();
		setTimeout(function() {
			ige.hud.show();
		}, 500);
	},

	onLoadError: function(message) {
		if (message === "Uncaught IGE *error* [IgeNetIoComponent] : Error with connection: Cannot establish connection, is server running?") {
			message = "Could not connect to the game server. It may be offline or down for maintenance."
		}

		$('#loading-error').show();
		$('#loading-error .message').html(message);
		$('.igeLoading.loadingFloat.preview').hide();
		ige._loadingPreText = "Error";
		$('#loadingText').html('Error');
		$('#loadingText').addClass('error');
	},


	promptForUsername: function() {
		ige.addComponent(NamePrompt);
	},

	takeFullscreen: function() {
		if ($('#fullscreen').is(':checked')
			&& (document.fullscreenEnabled
				|| document.webkitFullscreenEnabled
				|| document.mozFullScreenEnabled
				|| document.msFullscreenEnabled))
		{
			var body = document.body;
			if (body.requestFullscreen) {
				body.requestFullscreen();
			}
			else if (body.webkitRequestFullscreen) {
				body.webkitRequestFullscreen();
			}
			else if (body.mozRequestFullScreen) {
				body.mozRequestFullScreen();
			}
			else if (body.msRequestFullscreen) {
				body.msRequestFullscreen;
			}
			document.addEventListener("fullscreenchange", this.onFullscreenChange);
			document.addEventListener("webkitfullscreenchange", this.onFullscreenChange);
			document.addEventListener("mozfullscreenchange", this.onFullscreenChange);
			document.addEventListener("MSFullscreenChange", this.onFullscreenChange);
		}
		else {
			ige.hud.show();
		}
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
		/*setInterval(function() {
			ige.client.metrics.track('cosmos:engine.performance', {'FPS': ige.fps()});
		}, 200000); */// Send every 200s//This has been removed temporarially because the low send rate makes it not very useful. TODO: At some point let's make an aggregate statistic and send that over all at once.
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
