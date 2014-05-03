var Cap = IgeUiElement.extend({
	classId: "Cap",

	WIDTH: 40,
	HEIGHT: 40,

	LABEL_WIDTH: 100,
	STUB_HEIGHT: 10,

	STUB_COLOR: "rgb(70, 70, 70)",
	BG_COLOR: "rgb(50, 50, 50)",
	FG_COLOR: "rgb(255, 255, 255)",

	CAP_NAME: "Default",

	_label: undefined,

	init: function() {
		IgeUiElement.prototype.init.call(this);

		console.log("Initializing CapBar entry for " + this.classId() + "...");

		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		this.applyStyle({
			'borderBottomColor': this.STUB_COLOR,
			'borderBottomWidth': this.STUB_HEIGHT,
			'backgroundColor': this.BG_COLOR,
			'width': this.WIDTH,
			'height': this.HEIGHT
		});
	},

	name: function() {
		return this.CAP_NAME;
	}
});