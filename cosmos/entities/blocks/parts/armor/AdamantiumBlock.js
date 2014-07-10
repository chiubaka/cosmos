var AdamantiumBlock = Armor.extend({
	classId: 'AdamantiumBlock',

	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(24, 139, 34)";
			this.textureOutline = "rgb(20, 100, 20)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AdamantiumBlock; }
