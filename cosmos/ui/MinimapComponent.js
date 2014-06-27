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

	/**
	 * Gets the center of the current viewport and treats that as the coordinates
	 * to display.
	 * @memberof GPSLabel
	 * @instance
	 */
	getCoordinatesString: function() {
		var rect = ige.$('mainViewport').viewArea();
		return "x: " + Math.floor(rect.x2) + ", y: " + Math.floor(rect.y2);
	}
});

MinimapComponent.UI_ROOT = '/components/minimap/';

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = MinimapComponent;
}