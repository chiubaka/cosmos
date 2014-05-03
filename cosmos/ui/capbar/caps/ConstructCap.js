var ConstructCap = Cap.extend({
	classId: "ConstructCap",

	CAP_NAME: "Construct",
	STUB_COLOR: "rgb(0, 240, 20)",
	BG_COLOR: "rgb(0, 200, 16)",
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