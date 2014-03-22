var EngineBlock = Block.extend({
  classId: 'EngineBlock',

  init: function () {
    Block.prototype.init.call(this);

    if (!ige.isServer) {
      this.texture(ige.client.textures.block_engine);
    }
  }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = EngineBlock; }
