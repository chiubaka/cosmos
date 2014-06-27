var MinimapComponent = IgeEventingClass.extend({
	classId: 'MinimapComponent',
	componentId: 'minimap',

	element: undefined,

	/**
	 * The scene the minimap is displaying
	 * @type {IgeScene2d}
	 * @memberof MinimapComponent
	 * @private
	 * @instance
	 */
	 _scene: undefined,

	/**
	 * The camera the minimap is following
	 * @type {IgeCamera}
	 * @memberof MinimapComponent
	 * @private
	 * @instance
	 */
	 _camera: undefined,


	init: function() {
		var self = this;
		var hud = $('#hud');
		if (hud.length === 0) {
			this.log('HUD has not been initialized.', 'error');
			return;
		}

		this._scene = ige.client.spaceGameScene;
		this._camera = ige.client.mainViewport.camera;

		HUDComponent.loadHtml(MinimapComponent.UI_ROOT + 'minimap.html', function(html) {
			hud.append(html);
			self.element = $('#minimap');
			self.toolbar = self.element.find('.toolbar');
			self.button = self.toolbar.find('#map-button');
			self.zoomInButton = self.toolbar.find('.zoom-in-button');
			self.zoomOutButton = self.toolbar.find('.zoom-out-button');
			self.canvas = self.element.find('.map canvas')[0];
			self.coordinates = self.element.find('.map .coordinates');

			ige.addBehaviour('updateCoordinates', self.updateCoordinates);
			ige.addBehaviour('updateMinimap', self.updateMinimap);

			// Make canvas visually fill the positioned parent
			self.canvas.style.width = '100%';
			self.canvas.style.height = '100%';
			// Then set the internal size to match
			self.canvas.width  = self.canvas.offsetWidth;
			self.canvas.height = self.canvas.offsetHeight;

			// Offset the canvas draws so a draw to (0,0) is in the middle
			self.offsetX = self.canvas.width / 2;
			self.offsetY = self.canvas.height / 2;
			// Maps the visible minimap area to the canvas via a scale factor
			self.scaleX = Constants.minimapArea.MAXIMUM_WIDTH / self.canvas.width;
			self.scaleY = Constants.minimapArea.MAXIMUM_HEIGHT / self.canvas.height;
		});
	},

	show: function() {
		this.element.show();
	},

	hide: function() {
		this.element.hide();
	},

	updateCoordinates: function() {
		var minimap = ige.hud.minimap;
		minimap.coordinates.text(minimap.getCoordinatesString());
	},

	updateMinimap: function() {
		var ctx = ige.hud.minimap.canvas.getContext('2d');
		var width = ige.hud.minimap.canvas.width;
		var height = ige.hud.minimap.canvas.height;
		var offsetX = ige.hud.minimap.offsetX;
		var offsetY = ige.hud.minimap.offsetY;
		var scaleX = ige.hud.minimap.scaleX;
		var scaleY = ige.hud.minimap.scaleY;

		// Clear the minimap canvas so we can redraw the minimap
		ctx.clearRect(0, 0, width, height);
		var camTrans = ige.hud.minimap._camera._translate;

		var sceneChildren = ige.hud.minimap._scene.children();
		for (var i = 0; i < sceneChildren.length; i++) {
			ctx.save();

			var entity = sceneChildren[i];
			if (entity.streamEntityValid()) {
				// The player (show in green)
				if (entity === ige.client.player) {
					ctx.fillStyle = '#00FF00';
				}
				// Other players (show in red)
				else if (entity.classId() === 'Player') {
					ctx.fillStyle = '#FF0000';
				}
				// Other entities, such as asteroids (show in gray)
				else {
					ctx.fillStyle = '#808080';
				}

				// Calculate where to place the entity on the minimap
				var x = (entity.worldPosition().x - camTrans.x) / scaleX + offsetX;
				var y = (entity.worldPosition().y - camTrans.y) / scaleY + offsetY;

				// Calculate rectangle size, with a minimum rectangle size of 4x4
				// TODO: Draw actual shape, not just a box
				var w = Math.max(4, entity.width() / (scaleX * 1.5));
				var h = Math.max(4, entity.height() / (scaleY * 1.5));

				// Rotate entity around its center
				ctx.translate(x,y)
				ctx.rotate(entity.rotate().z());
				ctx.translate(-x,-y);
				ctx.fillRect(x, y, w, h);
				ctx.restore();
			}
		}
	},

	/**
	 * Gets the camera translation and treats that as the coordinates
	 * to display.
	 * @memberof MinimapComponent
	 * @instance
	 */
	getCoordinatesString: function() {
		var camTrans = ige.hud.minimap._camera._translate;
		// Round coordinates to nearest 100, then drop a digit.
		// Too much granularity is confusing.
		var x = Math.ceil(camTrans.x / 100) * 10;
		var y = Math.ceil(camTrans.y / 100) * 10;
		return "x: " + x + ", y: " + y;
	}
});

MinimapComponent.UI_ROOT = '/components/minimap/';

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = MinimapComponent;
}
