var VioletBlock = Armor.extend({
	classId: 'VioletBlock',

	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(77, 29, 77)";
			this.textureOutline = "rgb(60, 10, 60)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = VioletBlock; }
