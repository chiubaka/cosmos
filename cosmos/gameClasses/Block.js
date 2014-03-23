var Block = IgeEntity.extend({
	classId: 'Block',

	init: function () {
		IgeEntity.prototype.init.call(this);

		// Use an even number so values don't have to become approximate when we divide by two
		this.width(26).height(26);

		this.hp = 10; //this is the default hp of all blocks. Subclasses of block can have a different hp.

		if (!ige.isServer) {
			this.texture(ige.client.textures.block);

			// Enable caching so that the smart textures aren't reevaluated every time.
			this.compositeCache(true);
			this.cacheSmoothing(true);
		}
	},

	damage: function(amount) {
		this.hp -= amount;

		if (this.hp <= 0) {
			//TODO break the block from its block grid if it is in a block grid
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
