var GPSLabel = IgeUiLabel.extend({
	classId: "GPSLabel",

	init: function() {
		var self = this;

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

		setInterval(function() {
			var rect = ige.$('mainViewport').viewArea();
			self.value("x: " + Math.floor(rect.x2) + ", y: " + Math.floor(rect.y2));
			var calcWidth = self._fontEntity.measureTextWidth();
			self.width(calcWidth + 10);
		}, 300);
	},

	updateCoordinates: function() {

	}
 });

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = GPSLabel;
}