var DragonPlatingBlock = Armor.extend({
	classId: 'DragonPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x8B0000;
			this.borderColor = 0x780000;
			this.textureBackground = "rgb(139, 0, 0)";
			this.textureOutline = "rgb(120, 0, 0)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DragonPlatingBlock; }
