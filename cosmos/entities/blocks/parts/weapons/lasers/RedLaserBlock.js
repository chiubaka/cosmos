/**
 * Subclass of the {@link Part} class.
 * The {@link RedLaserBlock} class represents a block that can mine blocks. Better lasers will allow you to
 * (1) mine better blocks and (2) mine faster. If you don't have a laser you can't mine.
 * Also, note that lasers are currently the only weapon for combat.
 * @class
 * @typedef {RedLaserBlock}
 * @namespace
 */
var RedLaserBlock = Laser.extend({
	classId: 'RedLaserBlock',

	init: function(data) {
		if (!ige.isServer) {
			this.backgroundColor = 0xF2F2F2;
			this.borderColor = 0xD03F2C;
			this.iconFrame = 'RedLaser.png';

			this.textureBackground = "rgb(242, 242, 242)";
			this.textureOutline = "rgb(208, 63, 44)";
			this.textureSvg = ige.client.textures.redLaser;

			this.laserSpriteName = "RedLaserBeam.svg";
		}

		Laser.prototype.init.call(this, data);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = RedLaserBlock; }
