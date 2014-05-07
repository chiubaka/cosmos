var CapLabel = IgeUiLabel.extend({
	classId: "CapLabel",

	LABEL_MARGIN: 10,

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