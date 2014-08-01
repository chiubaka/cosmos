var CloakBlockVioletLight = Armor.extend({
	classId: 'CloakBlockVioletLight',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x9600D2;
			this.borderColor = 0xC828FF;
			this.backgroundAlpha = 0.3;
			this.borderAlpha = 0.5;
			this.textureBackground = "rgba(150, 0, 210, 0.3)";
			this.textureOutline = "rgba(200, 40, 260, 0.5)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlockVioletLight; }
