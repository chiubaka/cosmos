var Block = IgeEntity.extend({
	classId: 'Block',

	init: function () {
		IgeEntity.prototype.init.call(this);

		this.width(100).height(100);

		if (ige.isServer) {
			;
		}
		else {
			this.texture(ige.client.textures.block_power_gold);
		}

	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
