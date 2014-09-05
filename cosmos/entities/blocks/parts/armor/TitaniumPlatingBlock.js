var TitaniumPlatingBlock = Armor.extend({
	classId: 'TitaniumPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "TitaniumPlating.png";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = TitaniumPlatingBlock; }
