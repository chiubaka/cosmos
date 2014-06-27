var MinimapComponent = IgeEventingClass.extend({
	classId: 'MinimapComponent',
	componentId: 'minimap',

	element: undefined,

	init: function() {
		var self = this;
		var hud = $('#hud');
		if (hud.length === 0) {
			this.log('HUD has not been initialized.', 'error');
			return;
		}

		HUDComponent.loadHtml(MinimapComponent.UI_ROOT + 'minimap.html', function(html) {
			hud.append(html);
			self.element = $('#minimap');
			self.toolbar = self.element.find('.toolbar');
			self.button = self.toolbar.find('#map-button');
			self.zoomInButton = self.toolbar.find('.zoom-in-button');
			self.zoomOutButton = self.toolbar.find('.zoom-out-button');
			self.canvas = self.element.find('.map canvas');
			self.coordinates = self.element.find('.map .coordinates');

			ige.addBehaviour('updateCoordinates', self.updateCoordinates);
			ige.addBehaviour('updateMinimap', self.updateMinimap);
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
		var canvas = ige.hud.minimap.canvas[0];
		var ctx = canvas.getContext('2d');
		var width = canvas.width;
		var height = canvas.height;
		ctx.clearRect(0, 0, width, height);

		// TODO: Scene should be passed into component or set outside of component
		var scene = ige.$('spaceGameScene');
		for (var i = 0; i < scene.children().length; i++) {
			var child = scene.children[i];
			var rx = RandomInterval.randomIntFromInterval(0, width);
			var ry = RandomInterval.randomIntFromInterval(0, height);

			ctx.fillStyle = '#FF0000';
			ctx.fillRect(rx,ry,4,4);
		}

	},


	/**
	 * Gets the camera translation and treats that as the coordinates
	 * to display.
	 * @memberof MinimapComponent
	 * @instance
	 */
	getCoordinatesString: function() {
		var camTrans = ige.client.mainViewport.camera._translate;
		return "x: " + Math.floor(camTrans.x) + ", y: " + Math.floor(camTrans.y);
	}
});

MinimapComponent.UI_ROOT = '/components/minimap/';

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = MinimapComponent;
}
