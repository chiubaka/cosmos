var CloakBlock = Armor.extend({
	classId: 'CloakBlock',

	MAX_HP: 60,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgba(0, 0, 0, 0.7)";
			this.textureOutline = "rgba(200, 200, 200, 0.5)"
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlock; }
