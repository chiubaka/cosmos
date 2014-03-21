var Block = IgeEntity.extend({
	classId: 'Block',

	init: function () {
		IgeEntity.prototype.init.call(this);

		this.width(25).height(25);

		this.hp = 10; //this is the default hp of all blocks. Subclasses of block can have a different hp.

		if (!ige.isServer) {

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
