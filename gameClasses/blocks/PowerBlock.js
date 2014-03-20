var PowerBlock = Block.extend({
  classId: 'PowerBlock',

  init: function () {
    Block.prototype.init.call(this);

    if (!ige.isServer) {
      this.texture(ige.client.textures.block_power_gold);
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PowerBlock; }
