var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	/** Contains the grid of Block objects that make up this BlockGrid */
	_grid: [],
	/** Contains the Box2D physics fixtures for this block grid */
	_fixtures: [],
	/** The rendering container for this BlockGrid, which essentially provides a cacheable location for the BlockGrid's
	 * texture. */
	_renderContainer: undefined,

	init: function() {
		IgeEntityBox2d.prototype.init.call(this);

		this._renderContainer = new BlockGridRenderContainer()
			.streamMode(1)
			.mount(this);

		if (!ige.isServer) {
		}
	},

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
		this._grid.splice(this._grid.indexOf(block), 1);
		//this.box2DBody().fixtures.splice(this.box2Dbody().fixtures.indexOf(fixture), 1);
	},

	/**
	 * Getter/setter for the grid property of the BlockGrid. If a parameter is passed, sets
	 * the property and returns this. If not, returns the property.
	 * @parameter grid the grid to set (optional)
	 * @return this if we set the grid or the current grid otherwise
	 */
	grid: function(grid) {
		if (grid !== undefined) {
			this._grid = grid;

			fixtures = [];

			for (var row = 0; row < this._grid.length; row++) {
				var blockList = this._grid[row];
				for (var col = 0; col < blockList.length; col++) {
					var block = blockList[col];

					if (block === undefined) {
						continue;
					}

					block.mount(this._renderContainer);
					block.streamMode(1);

					var width = block.width();
					var height = block.height();

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
					block.onDeath = function () {
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
		}

		return this._grid;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
