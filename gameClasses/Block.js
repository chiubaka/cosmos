var Block = IgeEntity.extend({
	classId: 'Block',

	/**
	Construct a new block
	Note that block doesn't have any texture. This is because subclasses of Block are expected to have their own textures.
	*/
	init: function () {
		IgeEntity.prototype.init.call(this);

		this.width(25).height(25);

		this.hp = 10; //this is the default hp of all blocks. Subclasses of block can have a different hp.
	},

	/**
	Decreases the block's health by the amount passed.
	After health is decreased, the block may die.
	*/
	damage: function(amount) {
		this.hp -= amount;

		if (this.hp <= 0) {
			onDeath();
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
