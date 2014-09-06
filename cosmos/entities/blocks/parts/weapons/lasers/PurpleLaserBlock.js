/**
 * Subclass of the {@link Part} class.
 * The {@link PurpleLaserBlock} class represents a block that can mine blocks. Better lasers will allow you to
 * (1) mine better blocks and (2) mine faster. If you don't have a laser you can't mine.
 * Also, note that lasers are currently the only weapons for combat.
 * @class
 * @typedef {PurpleLaserBlock}
 * @namespace
 */
var PurpleLaserBlock = Laser.extend({
  classId: 'PurpleLaserBlock',

  init: function(data) {
    if (!ige.isServer) {
      this.backgroundColor = 0xF2F2F2;
      this.borderColor = 0xD00FDC;
      this.iconFrame = 'PurpleLaser.png';

      this.textureBackground = "rgb(242, 242, 242)";
      this.textureOutline = "rgb(208, 63, 244)";
      this.textureSvg = ige.client.textures.purpleLaser;

      this.laserSpriteName = "PurpleLaserBeam.svg";
    }

    Laser.prototype.init.call(this, data);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PurpleLaserBlock; }
