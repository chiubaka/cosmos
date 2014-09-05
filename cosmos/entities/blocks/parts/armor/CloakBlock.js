var CloakBlock = Armor.extend({
	classId: 'CloakBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x000000;
			this.borderColor = 0xC8C8C8;
			this.backgroundAlpha = 0.7;
			this.borderAlpha = 0.5;
			this.textureBackground = "rgba(0, 0, 0, 0.7)";
			this.textureOutline = "rgba(200, 200, 200, 0.5)"
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlock; }
