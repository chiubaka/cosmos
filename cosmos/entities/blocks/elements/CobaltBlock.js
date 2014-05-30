var CobaltBlock = Element.extend({
	classId: 'CobaltBlock',

	MAX_HP: 60,

	init: function () {
		data = {maxHp: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(42, 42, 242)";
			this.textureOutline = "rgb(38, 38, 38)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CobaltBlock; }
