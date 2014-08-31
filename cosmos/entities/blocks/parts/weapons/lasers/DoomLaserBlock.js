/**
 * Subclass of the {@link Part} class.
 * The {@link RedLaserBlock} class represents a block that can mine blocks. Better mining lasers will allow you to
 * (1) mine better blocks and (2) mine faster. If you don't have a mining laser you can't mine.
 * Also, note that mining lasers are currently the only weapon for combat.
 * @class
 * @typedef {RedLaserBlock}
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
    }

    Laser.prototype.init.call(this, data);
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DoomLaserBlock; }
