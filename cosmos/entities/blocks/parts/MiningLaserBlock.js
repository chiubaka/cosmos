var MiningLaserBlock = Part.extend({
	classId: 'MiningLaserBlock',

	MAX_HP: 50,

	init: function () {
		data = {MAX_HP: this.MAX_HP};
		Part.prototype.init.call(this, data);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(208, 63, 44)";
			this.textureSvg = ige.client.svgs.miningLaser;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MiningLaserBlock; }
