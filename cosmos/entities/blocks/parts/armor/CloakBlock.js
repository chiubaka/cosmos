var CloakBlock = Armor.extend({
	classId: 'CloakBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgba(0, 0, 0, 0.7)";
			this.textureOutline = "rgba(200, 200, 200, 0.5)"
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CloakBlock; }
