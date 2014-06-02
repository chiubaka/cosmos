var CobaltBlock = Element.extend({
	classId: 'CobaltBlock',

	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(0, 71, 171)";
			this.textureOutline = "rgb(0, 0, 128)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CobaltBlock; }
