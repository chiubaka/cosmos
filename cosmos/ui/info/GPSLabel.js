var GPSLabel = IgeUiLabel.extend({
	classId: "GPSLabel",

	init: function() {
		IgeUiLabel.prototype.init.call(this);

		this.applyStyle({
			'padding': 0,
			'top': 10,
			'left': 10
		});

		ige.ui.style('.gpsLabel', {
			'color': 'rgba(255, 255, 255, 1)',
			'padding': 0
		});

		this.font("12pt Segoe UI Semibold")
			.padding(0)
			.styleClass('gpsLabel');
	},

	getCoordinatesString: function() {
		var rect = ige.$('mainViewport').viewArea();
		return "x: " + Math.floor(rect.x2) + ", y: " + Math.floor(rect.y2);
	},

	resize: function() {
		var calcWidth = this._fontEntity.measureTextWidth();
		// + 10 here because for some reason the label clips the text otherwise
		this.width(calcWidth + 10);
	},

	update: function(ctx) {
		this.value(this.getCoordinatesString());
		this.resize();

		IgeUiLabel.prototype.update.call(this, ctx);
	}

});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = GPSLabel;
}
