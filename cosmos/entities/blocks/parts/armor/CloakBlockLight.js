var CloakBlockLight = Armor.extend({
	classId: 'CloakBlockLight',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgba(0, 0, 0, 0.3)";
			this.textureOutline = "rgba(200, 200, 200, 0.5)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlockLight; }
