var Block = IgeEntity.extend({
	classId: 'Block',
	WIDTH: 26,
	HEIGHT: 26,

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

			this.mouseDown(function(event, control) {
				this.unMount();
			});
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
	onDeath: function() {},

	blockFromClassId: function(classId) {
		switch (classId) {
			case Block.prototype.classId():
				return new Block();
			case CargoBlock.prototype.classId():
				return new CargoBlock();
			case ControlBlock.prototype.classId():
				return new ControlBlock();
			case EngineBlock.prototype.classId():
				return new EngineBlock();
			case FuelBlock.prototype.classId():
				return new FuelBlock();
			case MiningLaserBlock.prototype.classId():
				return new MiningLaserBlock();
			case PowerBlock.prototype.classId():
				return new PowerBlock();
			case ThrusterBlock.prototype.classId():
				return new ThrusterBlock();
			case CarbonBlock.prototype.classId():
				return new CarbonBlock();
			case IceBlock.prototype.classId():
				return new IceBlock();
			case IronBlock.prototype.classId():
				return new IronBlock();
			default:
				return undefined;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Block; }
