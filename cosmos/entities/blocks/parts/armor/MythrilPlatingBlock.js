var MythrilPlatingBlock = Armor.extend({
	classId: 'MythrilPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "MythrilPlating.png";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MythrilPlatingBlock; }
