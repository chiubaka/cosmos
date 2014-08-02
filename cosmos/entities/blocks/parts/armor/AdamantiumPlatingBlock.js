var AdamantiumPlatingBlock = Armor.extend({
	classId: 'AdamantiumPlatingBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0x188B22;
			this.borderColor = 0x146414;
			this.textureBackground = "rgb(24, 139, 34)";
			this.textureOutline = "rgb(20, 100, 20)";
		}

		Armor.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AdamantiumPlatingBlock; }
