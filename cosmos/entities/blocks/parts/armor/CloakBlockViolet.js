var CloakBlockViolet = Armor.extend({
	classId: 'CloakBlockViolet',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgba(100, 0, 160, 0.7)";
			this.textureOutline = "rgba(150, 0, 210, 0.5)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlockViolet; }
