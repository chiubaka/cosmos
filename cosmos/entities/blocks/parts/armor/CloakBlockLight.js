var CloakBlockLight = Armor.extend({
	classId: 'CloakBlockLight',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x000000;
			this.borderColor = 0xC8C8C8;
			this.textureBackground = "rgba(0, 0, 0, 0.3)";
			this.textureOutline = "rgba(200, 200, 200, 0.5)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlockLight; }
