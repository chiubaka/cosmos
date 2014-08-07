// TODO: Find and replace BlockGridNew with BlockGrid once this class completely takes the place of the old BlockGrid.

var BlockGridNew = IgeEntityBox2d.extend({
	classId: "BlockGridNew",

	_grid: undefined,
	_lowerLocBound: undefined,
	_upperLocBound: undefined,

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		this._grid = new SparseGrid();
		this._lowerLocBound = new IgePoint2d(0, 0);
		this._upperLocBound = new IgePoint2d(0, 0);

		// TODO: Create Box2dBody.

		// TODO: Finish BlockGridNew initialization.
	},

	count: function() {
		// TODO: Modify this so that the BlockGrid keeps its own count in order to properly support
		// blocks of multiple sizes, since several references will be placed in the underlying
		// SparseGrid for blocks that are larger than 1x1.
		return this._grid.count();
	},

	each: function(action) {
		// TODO: Call action with each block as a parameter. This is effectively an iterator.
	},

	get: function(location) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "warning");
			return;
		}

		return this._grid.get(location);
	},

	has: function(location) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#has.", "warning");
			return false;
		}

		return this._grid.has(location);
	},

	put: function(block, location) {
		// Validate parameters
		if (!block) {
			this.log("Invalid block passed to BlockGridNew#put.", "warning");
			return;
		}

		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#put.", "warning");
			return;
		}

		this._updateLocationBounds(location);

		block.location(location);

		// TODO: Determine where to place the block based on its row and column.
		var gridCoordinates = this._gridCoordinatesForBlock(block);

		// TODO: Add a fixture for the block.

		// TODO: Translate blocks to the right place within the BlockGrid based on row and column.

		// TODO: Modify this so that it places several references to blocks that are larger than
		// 1x1
		return this._grid.put(block,location);
	},

	remove: function(location) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "warning");
			return;
		}

		// TODO: Remove fixture for the block.

		return this._grid.remove(location);
	},

	_gridCoordinatesForBlock: function(block) {
		// If there are no blocks in this grid yet, then the grid coordinates should always be
		// (0, 0).
		if (this.count() === 0) {
			return {x: 0, y: 0};
		}

		var relLocation = this._relativeLocation(block.location());

		var x = Block.WIDTH * relLocation.x - this._bounds2d.x2 +
			(block.dimensions().cols * Block.WIDTH) / 2;
		var y = Block.HEIGHT * relLocation.y - this._bounds2d.y2 +
			(block.dimensions().rows * Block.HEIGHT) / 2;

		return {x: x, y: y};
	},

	/**
	 * Returns a new location object that represents the given location relative to the location
	 * bounds of this BlockGrid.
	 * @param location
	 * @private
	 */
	_relativeLocation: function(location) {
		return GridLocation.subtract(location, this._lowerLocBound);
	},

	_updateLocationBounds: function(location) {
		if (this.count() === 0) {
			this._lowerLocBound = GridLocation.copy(location);
			this._upperLocBound = GridLocation.copy(location);
			return;
		}

		// Update lower bound.
		this._lowerLocBound.x = Math.min(this._lowerLocBound.x, location.x);
		this._lowerLocBound.y = Math.min(this._lowerLocBound.y, location.y);

		// Update upper bound.
		this._upperLocBound.x = Math.max(this._upperLocBound.x, location.x);
		this._upperLocBound.y = Math.max(this._upperLocBound.y, location.y);
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = BlockGridNew; }
