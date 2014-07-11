var KryptoniteThrusterBlock = ThrusterBlock.extend({
	classId: 'KryptoniteThrusterBlock',

	init: function(data) {
		ThrusterBlock.prototype.init.call(this, data);

		if (Thrusts[this.classId()] !== undefined) {
			this.addComponent(Thrust, Thrusts[this.classId()]);
		}

		if (!ige.isServer) {
			this.textureBackground = "rgb(64, 64, 64)";
			this.textureOutline = "rgb(111, 167, 0)";
			this.textureSvg = ige.client.svgs.kryptoniteThruster;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = KryptoniteThrusterBlock; }
