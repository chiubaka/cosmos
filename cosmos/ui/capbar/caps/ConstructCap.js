var ConstructCap = Cap.extend({
	classId: "ConstructCap",

	CAP_NAME: "Construct",
	STUB_COLOR: "rgb(2,108,210)",
	BG_COLOR: "rgb(3,131,255)",
	FG_COLOR: "rgb(255,255,255)",
	STUB_ICON: undefined,
	ACTIVE_ICON: undefined,

	init: function() {
		this.STUB_ICON = ige.client.textures.constructCap_color;
		this.ACTIVE_ICON = ige.client.textures.constructCap_white;

		this._toolbar = new CargoToolbar();

		Cap.prototype.init.call(this);
	},
});