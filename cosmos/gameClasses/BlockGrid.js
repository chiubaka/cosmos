var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	grid: [], //this will be a grid of blocks

	fixtures: [],

	init: function () {
		IgeEntityBox2d.prototype.init.call(this);
	},

	remove: function(block, fixture) {
		this.grid.splice(this.grid.indexOf(block), 1);
		this.box2DBody().fixtures.splice(this.box2Dbody().fixtures.indexOf(fixture), 1);
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
				block.mount(this);
				block.streamMode(1);

				var width = block._width;

				var x = width * col;
				var y = width * row;

				block.translateTo(x, y, 0);

				fixture = {
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
				}

				fixtures.push(fixture);

				block.onDeath = function() {
					this.remove(block, fixture)
				};
			}
		}

		console.log(fixtures);

		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.4,
			angularDamping: 0.8,
			allowSleep: true,
			bullet: false,
			gravitic: true,
			fixedRotation: false,
			fixtures: fixtures
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
