var OrangeBlock = Armor.extend({
	classId: 'OrangeBlock',

	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(243, 134, 48)";
			this.textureOutline = "rgb(200, 100, 20)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = OrangeBlock; }
