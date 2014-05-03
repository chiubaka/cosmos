var Cap = IgeUiElement.extend({
	classId: "Cap",

	/**
	 * Defines the dimensions of a capability on the Capbar
	 */
	WIDTH: 40,
	HEIGHT: 40,
	STUB_HEIGHT: 10,

	/**
	 * Defines the styling and colors of the capbar
	 */
	// TODO: Move these into a centralized styles config
	DEFAULT_CLASS: '.capbar-cap',
	STUB_COLOR: "rgb(70, 70, 70)",
	BG_COLOR: "rgb(50, 50, 50)",
	FG_COLOR: "rgb(255, 255, 255)",
	TRANSPARENT: "rgba(0, 0, 0, 0)",

	/**
	 * Define the name of the capability and the title used by the Label
	 */
	CAP_NAME: "Default",
	_label: undefined,
	LABEL_COLOR: "rgb(255, 255, 255)",
	LABEL_WIDTH: 100,

	init: function() {
		IgeUiElement.prototype.init.call(this);

		console.log("Initializing CapBar entry for " + this.classId() + "...");

		// Set up the styling for this capability
		this.initStyles();

		// Set up labels
		this.initLabel();
	},

	initStyles: function()
	{
		this.width(this.WIDTH);
		this.height(this.HEIGHT);

		ige.ui.style(this.DEFAULT_CLASS, {
			'width': this.WIDTH,
			'height': this.HEIGHT
		});

		ige.ui.style('#' + this.classId(), {
			'borderBottomColor': this.STUB_COLOR,
			'borderBottomWidth': this.STUB_HEIGHT,
			'backgroundColor': this.TRANSPARENT
		});

		ige.ui.style('#' + this.classId() + ":hover", {
			'backgroundColor': this.BG_COLOR,
			'borderBottomColor': this.BG_COLOR,
		});

		this.styleClass('capbar-cap');
		this.id(this.classId());
	},

	initLabel: function() {
		this._label = new CapLabel(this.CAP_NAME, this.LABEL_COLOR)
			.mount(this);
	},

	name: function() {
		return this.CAP_NAME;
	}
});