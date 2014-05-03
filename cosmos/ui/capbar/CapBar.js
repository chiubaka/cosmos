var CapBar = IgeUiElement.extend({
	classId: "CapBar",

	/**
	 * The height of the capbar.
	 */
	HEIGHT: 40,

	CAP_SPACING: 10,

	_caps: undefined,

	init: function() {
		console.log("Initializing CapBar...");
		IgeEntity.prototype.init.call(this);

		this.applyStyle({
			'backgroundColor': '#dddddd',
			'borderColor': 'rgba(0,0,0,0)',
			'left': 0,
			'right': 0,
			'bottom': 0,
			'height': this.HEIGHT
		});
	},
});