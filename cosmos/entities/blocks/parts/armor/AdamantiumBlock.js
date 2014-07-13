var AdamantiumBlock = Armor.extend({
	classId: 'AdamantiumBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(24, 139, 34)";
			this.textureOutline = "rgb(20, 100, 20)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AdamantiumBlock; }
