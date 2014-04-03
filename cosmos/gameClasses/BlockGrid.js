var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	/** Contains the grid of Block objects that make up this BlockGrid */
	_grid: [],
	/** Contains the Box2D physics fixtures for this block grid */
	_fixtures: [],
	/** The rendering container for this BlockGrid, which essentially provides a cacheable location for the BlockGrid's
	 * texture. */
	_renderContainer: undefined,

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this);

		if (data !== undefined) {
			this.gridFromStreamCreateData(data);
		}

		if (!ige.isServer) {
			this._renderContainer = new IgeEntity()
				//.compositeCache(true)
				.mount(this);

			this.mountGrid();
		}
	},

	streamCreateData: function() {
		return this.streamCreateDataFromGrid(this._grid);
	},

	streamCreateDataFromGrid: function(grid) {
		var data = [];
		for (var i = 0; i < grid.length; i++) {
			var row = [];
			for (var j = 0; j < grid[i].length; j++) {
				var block = grid[i][j];
				if (block === undefined) {
					row.push(undefined);
					continue;
				}
				row.push(block.classId());
			}
			data.push(row);
		}
		return data;
	},

	gridFromStreamCreateData: function(data) {
		this._grid = [];
		for (var i = 0; i < data.length; i++) {
			var row = [];
			for (var j = 0; j < data[i].length; j++) {
				var classId = data[i][j];
				row.push(Block.prototype.blockFromClassId(classId));
			}
			this._grid.push(row);
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

			var maxRowLength = this.maxRowLengthForGrid(this._grid);

			this.height(Block.prototype.HEIGHT * this._grid.length)
				.width(Block.prototype.WIDTH * maxRowLength);

			for(var row = 0; row < this._grid.length; row++)
			{
				var blockList = this._grid[row];
				for(var col = 0; col < blockList.length; col++)
				{
					var block = blockList[col];

					if (block === undefined) {
						continue;
					}


					var width = Block.prototype.WIDTH;
					var height = Block.prototype.HEIGHT;

					var x = width * col - this._geometry.x2 + block._geometry.x2;
					var y = height * row - this._geometry.y2 + block._geometry.y2;

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
					};

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
	},

	mountGrid: function() {
		var maxRowLength = this.maxRowLengthForGrid(this._grid);

		this.height(Block.prototype.HEIGHT * this._grid.length)
			.width(Block.prototype.WIDTH * maxRowLength);
		this._renderContainer.height(this.height())
			.width(this.width());

		for (var row = 0; row < this._grid.length; row++) {
			for (var col = 0; col < this._grid[row].length; col++) {
				var block = this._grid[row][col];

				if (block === undefined) {
					continue;
				}

				var x = Block.prototype.WIDTH * col - this._geometry.x2 + block._geometry.x2;
				var y = Block.prototype.HEIGHT * row - this._geometry.y2 + block._geometry.y2;

				block.translateTo(x, y, 0)
					.mount(this._renderContainer);
			}
		}
	},

	maxRowLengthForGrid: function(grid) {
		var maxRowLength = 0;
		for (var row = 0; row < grid.length; row++) {
			if (grid[row].length > maxRowLength) {
				maxRowLength = grid[row].length;
			}
		}

		return maxRowLength;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
