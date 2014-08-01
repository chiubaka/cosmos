var KryptoniteThrusterBlock = ThrusterBlock.extend({
	classId: 'KryptoniteThrusterBlock',

	init: function(data) {
		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.backgroundColor = 0x404040;
			this.borderColor = 0x6FA700;
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(111, 167, 0)";
			this.textureSvg = ige.client.textures.kryptoniteThruster;
		}

		ThrusterBlock.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KryptoniteThrusterBlock; }
