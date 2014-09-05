var SteelPlatingBlock = Armor.extend({
	classId: 'SteelPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.iconFrame = "SteelPlating.png";
			this.backgroundColor = 0xA0A0A0;
			this.borderColor = 0xC9C9C9;
			this.textureBackground = "rgb(160, 160, 160)";
			this.textureOutline = "rgb(201, 201, 201)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelPlatingBlock; }
