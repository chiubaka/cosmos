var SparseGrid = IgeClass.extend({
	classId: 'SparseGrid',

	_count: undefined,
	_grid: undefined,

	init: function(data) {
		this._grid = {};
		this._count = 0;
		this._colCounts = {};
	},

	count: function() {
		return this._count;
	},

	get: function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			this.log("SparseGrid#get: no valid loc provided.", "warning");
			return;
		}

		// If the specified column doesn't exist, then grid[loc.col][loc.row] will throw an
		// exception so just return.
		if (!this._hasCol(loc.col)) {
			return;
		}

		return this._grid[loc.col][loc.row];
	},

	has: function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			this.log("SparseGrid#has: no valid loc provided.", "warning");
			return false;
		}

		return this._hasCol(loc.col) && this._grid[loc.col][loc.row] !== undefined;
	},

	put: function(object, loc) {
		if (object === undefined) {
			this.log("SparseGrid#put: no object parameter to put.", "warning");
			return;
		}

		if (!GridLocation.validateLocation(loc)) {
			this.log("SparseGrid#put: no valid loc provided.", "warning");
			return;
		}

		// If the specified column doesn't exist yet, create it because otherwise
		// grid[loc.col][loc.row] will throw an exception.
		if (!this._hasCol(loc.col)) {
			this._createCol(loc.col);
		}

		// Save the object that is already at this location, if any so that we can return it.
		var previousObject = this.get(loc);

		// Place the object at the specified location in the grid.
		this._grid[loc.col][loc.row] = object;

		// Update the number of items in the specified column.
		this._colCounts[loc.col]++;

		// Update the global count.
		this._count++;

		return previousObject;
	},

	remove: function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			this.log("SparseGrid#remove: no valid loc provided.", "warning");
			return;
		}

		// If we don't have anything at the specified location, there's nothing to do.
		if (!this.has(loc)) {
			return;
		}

		var previousObject = this._grid[loc.col][loc.row];

		// Remove the object at the specified location.
		delete this._grid[loc.col][loc.row];

		// Update the number of items in the specified column.
		this._colCounts[loc.col]--;

		// Update the global count.
		this._count--;

		// Clean up memory for the column if it is now empty.
		if (this._colCounts[loc.col] === 0) {
			delete this._grid[loc.col];
			delete this._colCounts[loc.col];
		}

		return previousObject;
	},

	_hasCol: function(col) {
		return this._grid[col] !== undefined;
	},

	_createCol: function(col) {
		this._grid[col] = {};
		this._colCounts[col] = 0;
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
