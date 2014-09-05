var AdamantiumPlatingBlock = Armor.extend({
	classId: 'AdamantiumPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = 'AdamantiumPlating.png';
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AdamantiumPlatingBlock; }
