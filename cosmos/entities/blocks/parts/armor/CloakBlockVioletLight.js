var CloakBlockVioletLight = Armor.extend({
	classId: 'CloakBlockVioletLight',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgba(150, 0, 210, 0.3)";
			this.textureOutline = "rgba(200, 40, 260, 0.5)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlockVioletLight; }
