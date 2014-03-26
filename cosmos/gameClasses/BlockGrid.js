var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	grid: [], //this will be a grid of blocks

	fixtures: [],

	/**
	Static function
	Returns a new block grid with the given dimensions.

	POTENTIAL BUG: are numCols and numRows swithed?
	*/
	newGridFromDimensions: function (numCols, numRows) {
		var grid = [];

		for (x = 0; x < numCols; x++) {
			var gridCol = [];
			for (y = 0; y < numRows; y++) {
				gridCol.push(new EngineBlock());
			}
			grid.push(gridCol);
		}

		return grid;
	},

	/**
	 * Remove is intended to remove the block from the grid,
	 * and also remove the fixture from the list of fixtures in the box2D object.
	 */
	remove: function(block, fixture) {
		this.grid.splice(this.grid.indexOf(block), 1);
		//this.box2DBody().fixtures.splice(this.box2Dbody().fixtures.indexOf(fixture), 1);
	},

	/**
	 * getGrid returns the array of arrays which represents the grid of blocks that this BlockGrid is composed of.
	 */
	getGrid: function() {
		return this.grid;
	},
	/**
	 * setGrid sets the grid of this BlockGrid. This both updates the grid property (accessible with getGrid()),
	 * and also updates this BlockGrid's box2d object to have the appropriate fixtures.
	 */
	setGrid: function(newGrid) {
		this.grid = newGrid;

		fixtures = [];

		for(var row = 0; row < this.grid.length; row++)
		{
			var blockList = this.grid[row];
			for(var col = 0; col < blockList.length; col++)
			{
				var block = blockList[col];

				if (block === undefined) {
					continue;
				}

				block.mount(this);
				block.streamMode(1);

				var width = block._width;
				var height = block._height;

				var x = width * col;
				var y = height * row;

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
							height: height / 2
						}
					}
				}

				fixtures.push(fixture);

				self = this;
				block.onDeath = function() {
					self.remove(block, fixture)
				};
			}
		}

		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.4,
			angularDamping: 0.8,
			allowSleep: true,
			bullet: false,
			gravitic: false,
			fixedRotation: false,
			fixtures: fixtures
		});

		return this;
	},

	/**
	* Called every frame by the engine when this entity is mounted to the
	* scenegraph.
	* @param ctx The canvas context to render to.
	*/
	tick: function (ctx) {
		//Call the tick function of the super class, IgeEntityBox2d.
		IgeEntityBox2d.prototype.tick.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
