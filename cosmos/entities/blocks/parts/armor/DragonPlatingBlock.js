var DragonPlatingBlock = Armor.extend({
	classId: 'DragonPlatingBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(139, 0, 0)";
			this.textureOutline = "rgb(120, 0, 0)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DragonPlatingBlock; }
