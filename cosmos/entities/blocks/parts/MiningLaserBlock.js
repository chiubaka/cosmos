/**
 * Mining lasers allow you to mine asteroids. Better mining lasers will allow you to (1) mine better blocks and (2) mine faster.
 * If you don't have a mining laser you can't mine.
 * Also note that mining lasers are the only weapon for combat currently.
 */
var MiningLaserBlock = Part.extend({
	classId: 'MiningLaserBlock',

	init: function () {
		Part.prototype.init.call(this);

		if (!ige.isServer) {
			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(255, 0, 0)";
			this.textureSvg = ige.client.svgs.miningLaser;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MiningLaserBlock; }
