var CapLabel = IgeUiLabel.extend({
	classId: "CapLabel",

	LABEL_MARGIN: 10,

	init: function(value, color) {
		IgeUiLabel.prototype.init.call(this);

		this.font("12pt Segoe UI Semibold")
			.padding(0)
			.value(value)
			.color(color);

		// Need to manually calculate width because labels don't do it automatically
		// Increase by 10px to offset margin compensation
		var calcWidth = this._fontEntity.measureTextWidth() + 10;
		this.width(calcWidth);

		// Move labels above icons, translate to the right to make 
		this.translateTo(5, -this.height(), 0);
	},
});