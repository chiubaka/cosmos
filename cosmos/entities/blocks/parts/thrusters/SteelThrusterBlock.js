var SteelThrusterBlock = ThrusterBlock.extend({
	classId: 'SteelThrusterBlock',

	init: function(data) {
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.backgroundColor = 0x6E6E64;
			this.borderColor = 0xFF4E00;
			this.textureBackground = "rgb(110, 110, 110)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.textures.thruster;
		}

		ThrusterBlock.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelThrusterBlock; }
