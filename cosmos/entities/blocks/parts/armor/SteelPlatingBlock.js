var SteelPlatingBlock = Armor.extend({
	classId: 'SteelPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x646464;
			this.borderColor = 0x505050;
			this.textureBackground = "rgb(100, 100, 100)";
			this.textureOutline = "rgb(80, 80, 80)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelPlatingBlock; }
