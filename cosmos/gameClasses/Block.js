var Block = IgeEntity.extend({
	classId: 'Block',

	/**
	 * Construct a new block
	 * Note that block doesn't have any texture. This is because subclasses of Block are expected to have their own textures.
	 */
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

	/**
	 * Decreases the block's health by the amount passed.
	 * After health is decreased, the block may die.
	 */
	damage: function(amount) {
		this.hp -= amount;

		if (this.hp <= 0) {
			this.onDeath();
		}
	},

	/**
	onDeath will be called when the block reaches 0 or less hp
	Objects that contain blocks should set the onDeath function to be something more useful.
	For example, the blockGrid class should set the block's onDeath function to break off from the grid.
	*/
	onDeath: function() {}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
