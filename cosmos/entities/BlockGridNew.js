// TODO: Find and replace BlockGridNew with BlockGrid once this class completely takes the place of the old BlockGrid.

var BlockGridNew = IgeEntityBox2d.extend({
	classId: "BlockGridNew",

	_grid: undefined,
	_lowerLocBound: undefined,
	_upperLocBound: undefined,

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		this._grid = new SparseGrid();

		this.width(0);
		this.height(0);

		// TODO: Create Box2dBody.

		// TODO: Finish BlockGridNew initialization.
	},

	count: function() {
		return this._grid.count();
	},

	each: function(func, location, width, height) {
		return this._grid.each(func, location, width, height);
	},

	get: function(location, width, height) {
		return this._grid.get(location, width, height);
	},

	has: function(location, width, height) {
		return this._grid.has(location, width, height);
	},

	put: function(block, location, replace) {
		// Validate parameters
		if (!block) {
			this.log("Invalid block passed to BlockGridNew#put.", "warning");
			return;
		}

		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#put.", "warning");
			return;
		}

		var previousBlocks = this._grid.put(block, location, replace);

		if (previousBlocks === null) {
			return null;
		}

		this.width(this._grid.width() * Block.WIDTH);
		this.height(this._grid.height() * Block.HEIGHT);

		// TODO: Determine where to place the block based on its row and column.
		var gridCoordinates = this._gridCoordinatesForBlock(block);

		// TODO: Add a fixture for the block.

		// TODO: Translate blocks to the right place within the BlockGrid based on row and column.

		// TODO: Modify this so that it places several references to blocks that are larger than
		// 1x1
		return previousBlocks;
	},

	remove: function(location, width, height) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "warning");
			return;
		}

		// TODO: Remove fixture for the block.

		return this._grid.remove(location, width, height);
	},

	_gridCoordinatesForBlock: function(block) {
		// If there are no blocks in this grid yet, then the grid coordinates should always be
		// (0, 0).
		if (this.count() === 0) {
			return {x: 0, y: 0};
		}

		var relLoc = this._grid.relativeLocation(block.gridData.loc);

		var coordinates =
		{
			x: Block.WIDTH * relLoc.x - this._bounds2d.x2 + block._bounds2d.x2,
			y: Block.HEIGHT * relLoc.y - this._bounds2d.y2 + block._bounds2d.y2
		}

		return coordinates;
	},

	/**
	 * Returns a new location object that represents the given location relative to the location
	 * bounds of this BlockGrid.
	 * @param location
	 * @private
	 */
	_relativeLocation: function(location) {
		return GridLocation.subtract(location, this._lowerLocBound);
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = BlockGridNew; }
