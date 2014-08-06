// TODO: Find and replace BlockGridNew with BlockGrid once this class completely takes the place of the old BlockGrid.

var BlockGridNew = IgeEntityBox2d.extend({
	classId: "BlockGridNew",

	_grid: undefined,
	_lowerLocBound: undefined,
	_upperLocBound: undefined,

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		this._grid = new SparseGrid();
		this._lowerLocBound = new GridLocation(0, 0);
		this._upperLocBound = new GridLocation(0, 0);

		// TODO: Create Box2dBody.

		// TODO: Finish BlockGridNew initialization.
	},

	count: function() {
		return this._grid.count();
	},

	each: function(action) {
		// TODO: Call action with each block as a parameter. This is effectively an iterator.
	},

	get: function(location) {
		// Validate parameters
		if (!GridLocation.validateLocation(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "warning");
			return;
		}

		return this._grid.get(location);
	},

	has: function(location) {
		// Validate parameters
		if (!GridLocation.validateLocation(location)) {
			this.log("Invalid location passed to BlockGridNew#has.", "warning");
		}

		return this._grid.has(location);
	},

	put: function(block, location) {
		// Validate parameters
		if (!block) {
			this.log("Invalid block passed to BlockGridNew#put.", "warning");
			return;
		}

		if (!GridLocation.validateLocation(location)) {
			this.log("Invalid location passed to BlockGridNew#put.", "warning");
			return;
		}

		this._updateLocationBounds(location);

		// TODO: Determine where to place the block based on its row and column.
		var gridCoordinates = this._gridCoordinatesForLocation(location);

		// TODO: Add a fixture for the block.

		// TODO: Translate blocks to the right place within the BlockGrid based on row and column.

		return this._grid.put(block,location);
	},

	remove: function(location) {
		// Validate parameters
		if (!GridLocation.validateLocation(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "warning");
			return;
		}

		// TODO: Remove fixture for the block.

		return this._grid.remove(location);
	},

	_gridCoordinatesForLocation: function(location) {
		// If there are no blocks in this grid yet, then the grid coordinates should always be
		// (0, 0).
		if (this.count() === 0) {
			return {x: 0, y: 0};
		}
	},

	_updateLocationBounds: function(location) {
		// Update lower bound.
		this._lowerLocBound.col = Math.min(this._lowerLocBound.col, location.col);
		this._lowerLocBound.row = Math.min(this._lowerLocBound.row, location.row);

		// Update upper bound.
		this._upperLocBound.col = Math.max(this._upperLocBound.col, location.col);
		this._upperLocBound.row = Math.max(this._upperLocBound.row, location.row);
	},

	_validLocation: function(location) {
		return location && location.row && location.col;
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = BlockGridNew; }
