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
		var offsetX = width/2;
		var offsetY = height/2;

		ctx.clearRect(0, 0, width, height);
		var camTrans = ige.client.mainViewport.camera._translate;

		// TODO: Scene should be passed into component or set outside of component
		var sceneChildren = ige.client.spaceGameScene.children();
		for (var i = 0; i < sceneChildren.length; i++) {
			var entity = sceneChildren[i];
			if (entity.streamEntityValid()) {
				var mx = (entity.worldPosition().x - camTrans.x)/60 + offsetX;
				var my = (entity.worldPosition().y - camTrans.y)/60 + offsetY;

				ctx.fillStyle = '#FF0000';
				ctx.fillRect(mx,my,4,4);
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
		var camTrans = ige.client.mainViewport.camera._translate;
		return "x: " + Math.floor(camTrans.x) + ", y: " + Math.floor(camTrans.y);
	}
});

MinimapComponent.UI_ROOT = '/components/minimap/';

if (typeof(module) !== 'undefined' && typeof(module.expoerts) !== 'undefined') {
	module.exports = MinimapComponent;
}
