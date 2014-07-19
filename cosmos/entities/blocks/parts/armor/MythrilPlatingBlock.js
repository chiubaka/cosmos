var MythrilPlatingBlock = Armor.extend({
	classId: 'MythrilPlatingBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(140, 165, 217)";
			this.textureOutline = "rgb(120, 145, 200)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MythrilPlatingBlock; }
