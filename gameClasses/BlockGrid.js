var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	grid: [], //this will be a grid of blocks

	init: function () {
		IgeEntityBox2d.prototype.init.call(this);
	},

	setGrid: function(newGrid) {
		this.grid = newGrid;

		fixtures = [];

		this.width(500);
		this.height(500);

		var width = 50;

		for(var row = 0; row < this.grid.length; row++)
		{
			var blockList = this.grid[row];
			for(var col = 0; col < blockList.length; col++)
			{
				var block = blockList[col];
				block.mount(this);
				block.streamMode(1);

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
							width: width,
							height: width
						}
					}
				});
			}
		}

		console.log(fixtures);

		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.0,
			angularDamping: 0.1,
			allowSleep: true,
			bullet: false,
			gravitic: true,
			fixedRotation: false,
			fixtures: fixtures
			/*fixtures: [{
				density: 1.0,
				friction: 0.5,
				restitution: 0.2,
				shape: {
					type: 'rectangle',
					data: {x:700, y:0}
				}
			}]*/
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
