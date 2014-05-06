var MineCap = Cap.extend({
	classId: "MineCap",

	CAP_NAME: "Mine",
	STUB_COLOR: "rgb(200,32,32)",
	BG_COLOR: "rgb(255,64,64)",
	FG_COLOR: "rgb(255, 255, 255)",
	STUB_ICON: undefined,
	ACTIVE_ICON: undefined,

	init: function() {
		this.STUB_ICON = ige.client.textures.mineCap_color;
		this.ACTIVE_ICON = ige.client.textures.mineCap_white;

		Cap.prototype.init.call(this);
	},
});