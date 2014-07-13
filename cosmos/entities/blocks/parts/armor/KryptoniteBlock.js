var KryptoniteBlock = Armor.extend({
	classId: 'KryptoniteBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgba(169, 255, 0, 0.8)";
			this.textureOutline = "rgb(111, 167, 0)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KryptoniteBlock; }
