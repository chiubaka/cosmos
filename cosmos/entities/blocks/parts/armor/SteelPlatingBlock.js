var SteelPlatingBlock = Armor.extend({
	classId: 'SteelPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "SteelPlating.png";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelPlatingBlock; }
