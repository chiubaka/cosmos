var BlockGrid = IgeEntity.extend({
	classId: 'BlockGrid',
	
	grid: [], //this will be a grid of blocks

	init: function (grid) {
		IgeEntity.prototype.init.call(this);

		this.grid = grid;

		if (!ige.isServer) {
		}
	},

	/**
	Connects all of the blocks in the grid to their neighbors.
	This method currently assumes that the grid is rectangular (all the sublists have the same length)
	*/
	connectAdjacentBlocks: function () {
		for(x=0; x<grid.length; x++)
			for(y=0; y<grid[0].length; y++) {
				grid[x][y].connect(grid[x+1][y]);//this isn't the actual syntax yet...
				//...
			}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
