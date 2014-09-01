/**
 * Subclass of the {@link Part} class.
 * The {@link DoomLaserBlock} class represents a block that can mine blocks. Better lasers will allow you to
 * (1) mine better blocks and (2) mine faster. If you don't have a laser you can't mine.
 * Also, note that lasers are currently the only weapons for combat.
 * @class
 * @typedef {DoomLaserBlock}
 * @namespace
 */
var DoomLaserBlock = Laser.extend({
  classId: 'DoomLaserBlock',

  init: function(data) {
    data = {MAX_HP: this.MAX_HP};

    if (!ige.isServer) {
      this.backgroundColor = 0xF2F2F2;
      this.borderColor = 0x000000;
      this.iconFrame = 'doomLaser.svg';

      this.textureBackground = "rgb(242, 242, 242)";
      this.textureOutline = "rgb(0, 0, 0)";
      this.textureSvg = ige.client.textures.doomLaser;

      this.laserSpriteName = "doomLaserBeam.svg";
    }

    Laser.prototype.init.call(this, data);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DoomLaserBlock; }
