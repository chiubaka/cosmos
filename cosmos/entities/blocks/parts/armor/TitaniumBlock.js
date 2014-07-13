var TitaniumBlock = Armor.extend({
	classId: 'TitaniumBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(250, 250, 250)";
			this.textureOutline = "rgb(200, 200, 200)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TitaniumBlock; }
