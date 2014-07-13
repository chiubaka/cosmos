var OrangeBlock = Armor.extend({
	classId: 'OrangeBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(243, 134, 48)";
			this.textureOutline = "rgb(200, 100, 20)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = OrangeBlock; }
