var Block = IgeEntity.extend({
	classId: 'Block',
	
	init: function () {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.texture(ige.client.textures.block_power_gold)
					.width(100)
					.height(100);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
