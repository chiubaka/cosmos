var KryptonitePlatingBlock = Armor.extend({
	classId: 'KryptonitePlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "KryptonitePlating.png";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KryptonitePlatingBlock; }
