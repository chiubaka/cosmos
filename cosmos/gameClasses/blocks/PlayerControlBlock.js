var PlayerControlBlock = Block.extend({
  classId: 'PlayerControlBlock',

  init: function () {
    Block.prototype.init.call(this);

    if (!ige.isServer) {
      this.texture(ige.client.textures.playerControlBlock);
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerControlBlock; }
