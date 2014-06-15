/**
 * A CapLabel encapsulates the text label that is shown when a player hovers over
 * a Cap in the CapBar. It is mounted to the Cap itself.
 *
 * @class
 * @typedef {Object} CapLabel
 * @namespace  
 */
 var CapLabel = IgeUiLabel.extend({
	classId: "CapLabel",

	/**
	 * The default spacing between the top of the Cap in the CapBar (the height of
	 * the CapBar, essentially), and the bottom of the label.
	 * @constant {number}
	 * @memberof CapLabel
	 * @instance
	 * @default
	 */
	LABEL_MARGIN: 10,

	/**
	 * Initializes the CapLabel, sets up its UI styling and fonts, and positions it
	 * relative to the Cap that instantiated it.
	 *
	 * @param id {string} the style ID of the cap that instantiated it
	 * @param value {string} the text the label should display
	 * @param color {string} the RGB Color value the label should be when its parent cap is being hovered over
	 * @memberof CapLabel
	 * @instance
	 */
	init: function(id, value, color) {
		IgeUiLabel.prototype.init.call(this);

		var styleClass = id + '-label';
		ige.ui.style('.' + styleClass, {
			'color': 'rgba(0, 0, 0, 0)',
		});

		ige.ui.style('.' + styleClass + ':hover', {
			'color': color
		});

		this.font("12pt Segoe UI Semibold")
			.padding(0)
			.value(value)
			.styleClass(styleClass);					 

		// Need to manually calculate width because labels don't do it automatically
		// Increase by 10px to offset margin compensation
		var calcWidth = this._fontEntity.measureTextWidth() + 10;
		this.width(calcWidth);

		// Move labels above icons, translate to the right to make 
		this.translateTo(5, Math.floor(-this.height() - this.LABEL_MARGIN), 0);
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CapLabel;
}