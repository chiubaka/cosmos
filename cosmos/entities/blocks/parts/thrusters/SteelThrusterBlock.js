var SteelThrusterBlock = ThrusterBlock.extend({
	classId: 'SteelThrusterBlock',

	init: function(data) {
		ThrusterBlock.prototype.init.call(this, data);

		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.textureBackground = "rgb(110, 110, 110)";
			this.textureOutline = "rgb(100, 100, 100)";
			this.textureSvg = ige.client.textures.kryptoniteThruster;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = SteelThrusterBlock; }
