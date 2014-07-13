var DragonBlock = Armor.extend({
	classId: 'DragonBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(139, 0, 0)";
			this.textureOutline = "rgb(120, 0, 0)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DragonBlock; }
