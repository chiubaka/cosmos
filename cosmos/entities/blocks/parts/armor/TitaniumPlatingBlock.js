var TitaniumPlatingBlock = Armor.extend({
	classId: 'TitaniumPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xFAFAFA;
			this.borderColor = 0xC8C8C8;
			this.textureBackground = "rgb(250, 250, 250)";
			this.textureOutline = "rgb(200, 200, 200)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TitaniumPlatingBlock; }
