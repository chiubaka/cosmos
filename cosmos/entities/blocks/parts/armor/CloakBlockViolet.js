var CloakBlockViolet = Armor.extend({
	classId: 'CloakBlockViolet',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x6400A0;
			this.borderColor = 0x9600D2;
			this.backgroundAlpha = 0.7;
			this.borderAlpha = 0.5;
			this.textureBackground = "rgba(100, 0, 160, 0.7)";
			this.textureOutline = "rgba(150, 0, 210, 0.5)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlockViolet; }
