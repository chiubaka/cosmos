var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	grid: [], //this will be a grid of blocks

	init: function () {
		IgeEntityBox2d.prototype.init.call(this);
	},

	setGrid: function(newGrid) {
		this.grid = newGrid;

		//console.log("Here's the grid:");
		//console.log(this.grid);
		for(var row = 0; row < this.grid.length; row++)
		{
			var blockList = this.grid[row];
			//console.log("Here's the list:");
			//console.log(blockList);
			for(var col = 0; col < blockList.length; col++)
			{
				var block = blockList[col];
				//console.log("Here's the block:");
				//console.log(block);
				block.mount(this);
				block.streamMode(1);
			}
		}

		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.0,
			angularDamping: 0.1,
			allowSleep: true,
			bullet: false,
			gravitic: true,
			fixedRotation: false,
			fixtures: [{
				density: 1.0,
				friction: 0.5,
				restitution: 0.5,
				shape: {
					type: 'square',
					data: {
						// The position of the fixture relative to the body
						x: 0,
						y: 0
					}
				}
			}]
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
