var DragonPlatingBlock = Armor.extend({
	classId: 'DragonPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "DragonPlating.png";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DragonPlatingBlock; }
