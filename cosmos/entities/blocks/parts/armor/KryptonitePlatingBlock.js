var KryptonitePlatingBlock = Armor.extend({
	classId: 'KryptonitePlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "KryptonitePlating.png";
			this.backgroundColor = 0xA9FF00;
			this.borderColor = 0x6FA700;
			this.backgroundAlpha = 0.8;
			this.textureBackground = "rgba(169, 255, 0, 0.8)";
			this.textureOutline = "rgb(111, 167, 0)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KryptonitePlatingBlock; }
