var SteelThrusterBlock = ThrusterBlock.extend({
	classId: 'SteelThrusterBlock',

	init: function(data) {
		ThrusterBlock.prototype.init.call(this, data);

		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.textureBackground = "rgb(160, 160, 160)";
			this.textureOutline = "rgb(255, 78, 0)";
			this.textureSvg = ige.client.textures.thruster;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelThrusterBlock; }
