/**
 * The GPSLabel provides players with a rudimentary coordinate printout with which
 * to get their bearings with.
 *
 * @class
 * @typedef {Object} GPSLabel
 * @namespace  
 */
var GPSLabel = IgeUiLabel.extend({
	classId: "GPSLabel",

	/**
	 * Initializes the label's styles and size.
	 * @memberof GPSLabel
	 * @instance
	 */
	init: function() {
		IgeUiLabel.prototype.init.call(this);

		this.applyStyle({
			'padding': 0,
			'top': 10,
			'left': 10
		});

		ige.ui.style('.gpsLabel', {
			'color': 'rgb(255, 255, 255)',
			'padding': 0
		});

		this.font("12pt Segoe UI Semibold")
			.padding(0)
			.styleClass('gpsLabel');

		// Set initial label size.
		// TODO: Resize intelligently (not every update) if we need to
		this.value("Loading viewport position...");
		this.resize();
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
	},

	/**
	 * Updates the width of the GPSLabel to match the coordinates provided.
	 * @memberof GPSLabel
	 * @instance
	 */
	resize: function() {
		var calcWidth = this._fontEntity.measureTextWidth();
		// + 10 here because for some reason the label clips the text otherwise
		this.width(calcWidth + 10);
	},

	/**
	 * Overrides the IgeUiLabel update call to make sure that GPS coordinates are
	 * updated every engine tick.
	 * @memberof GPSLabel
	 * @instance
	 */
	update: function(ctx) {
		this.value(this.getCoordinatesString());

		IgeUiLabel.prototype.update.call(this, ctx);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = GPSLabel;
}
