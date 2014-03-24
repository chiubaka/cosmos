var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	grid: [], //this will be a grid of blocks

	init: function () {
		IgeEntityBox2d.prototype.init.call(this);
	},

	setGrid: function(newGrid) {
		this.grid = newGrid;

		fixtures = [];

		for(var row = 0; row < this.grid.length; row++)
		{
			var blockList = this.grid[row];
			for(var col = 0; col < blockList.length; col++)
			{
				var block = blockList[col];
				if (block === undefined)
				{
					continue;
				}
				block.mount(this);
				block.streamMode(1);

				var width = block._width;

				var x = width * col;
				var y = width * row;

				block.translateTo(x, y, 0);

				fixtures.push({
					density: 1.0,
					friction: 0.5,
					restitution: 0.5,
					shape: {
						type: 'rectangle',
						data: {
							// The position of the fixture relative to the body
							x: x,
							y: y,
							width: width / 2, //I don't know why we have to devide by two here to make this come out right : (
							height: width / 2
						}
					}
				});
			}
		}

		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.4,
			angularDamping: 0.3,
			allowSleep: true,
			bullet: false,
			gravitic: true,
			fixedRotation: false,
			fixtures: fixtures
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
