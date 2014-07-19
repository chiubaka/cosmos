var SteelPlatingBlock = Armor.extend({
	classId: 'SteelPlatingBlock',

	init: function(data) {
		Armor.prototype.init.call(this, data);


		if (!ige.isServer) {
			this.textureBackground = "rgb(100, 100, 100)";
			this.textureOutline = "rgb(80, 80, 80)";
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelPlatingBlock; }
