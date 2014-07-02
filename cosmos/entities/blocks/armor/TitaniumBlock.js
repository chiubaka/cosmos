var TitaniumBlock = Armor.extend({
	classId: 'TitaniumBlock',

	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(250, 250, 250)";
			this.textureOutline = "rgb(200, 200, 200)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TitaniumBlock; }
