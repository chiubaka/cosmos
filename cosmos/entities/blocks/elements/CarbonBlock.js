var CarbonBlock = Element.extend({
	classId: 'CarbonBlock',

	MAX_HP: 15,

	init: function () {
		data = {maxHp: this.MAX_HP};
		Element.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(40, 40, 40)";
			this.textureOutline = "rgb(80, 80, 80)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CarbonBlock; }
