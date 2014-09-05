var MythrilPlatingBlock = Armor.extend({
	classId: 'MythrilPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "MythrilPlating.png";
			this.backgroundColor = 0x8CA5D9;
			this.borderColor = 0x7891C8;
			this.textureBackground = "rgb(140, 165, 217)";
			this.textureOutline = "rgb(120, 145, 200)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MythrilPlatingBlock; }
