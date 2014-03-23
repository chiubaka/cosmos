/**
Consider deprecating this class. Is a ship actually anything but a grid of blocks (with a player componenet)? 
*/

var Ship = BlockGrid.extend({
	classId: 'Ship',

	init: function () {
		this.connectAdjacentBlocks();

		IgeEntity.prototype.init.call(this);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Ship; }
