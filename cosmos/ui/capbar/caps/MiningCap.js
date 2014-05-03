var MiningCap = Cap.extend({
	classId: "MiningCap",

	CAP_NAME: "Mine",
	STUB_COLOR: "rgb(220, 0, 0)",
	BG_COLOR: "rgb(240, 0, 0)",
	FG_COLOR: "rgb(255, 255, 255)",

	init: function() {
		Cap.prototype.init.call(this);

		this.applyStyle({
			'borderBottomColor': this.STUB_COLOR,
			'borderBottomWidth': this.STUB_HEIGHT,
			'backgroundColor': this.BG_COLOR
		});
	},
});