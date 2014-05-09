var MineCap = Cap.extend({
	classId: "MineCap",

	CAP_NAME: "Mine",
	STUB_COLOR: "rgb(200,32,32)",
	ACTIVE_COLOR: "rgb(200, 32, 32)",
	ACTIVE_STUB_COLOR: "rgb(255, 64, 64)",
	HOVER_COLOR: 'rgb(255, 64, 64)',

	STUB_ICON: undefined,
	ACTIVE_ICON: undefined,

	init: function() {
		this.STUB_ICON = ige.client.textures.mineCap_color;
		this.ACTIVE_ICON = ige.client.textures.mineCap_white;

		Cap.prototype.init.call(this);
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = MineCap;
}