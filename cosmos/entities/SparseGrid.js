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
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#get: no valid loc provided.", "warning");
			return;
		}

		// If the specified column doesn't exist, then grid[loc.x][loc.y] will throw an
		// exception so just return.
		if (!this._hasX(loc.x)) {
			return;
		}

		return this._grid[loc.x][loc.y];
	},

	has: function(loc) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#has: no valid loc provided.", "warning");
			return false;
		}

		return this._hasX(loc.x) && this._grid[loc.x][loc.y] !== undefined;
	},

	put: function(object, loc) {
		if (object === undefined) {
			this.log("SparseGrid#put: no object parameter to put.", "warning");
			return;
		}

		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#put: no valid loc provided.", "warning");
			return;
		}

		// If the specified column doesn't exist yet, create it because otherwise
		// grid[loc.x][loc.y] will throw an exception.
		if (!this._hasX(loc.x)) {
			this._createX(loc.x);
		}

		// Save the object that is already at this location, if any so that we can return it.
		var previousObject = this.get(loc);

		// Place the object at the specified location in the grid.
		this._grid[loc.x][loc.y] = object;

		// Update the number of items in the specified column.
		this._colCounts[loc.x]++;

		// Update the global count.
		this._count++;

		return previousObject;
	},

	remove: function(loc) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#remove: no valid loc provided.", "warning");
			return;
		}

		// If we don't have anything at the specified location, there's nothing to do.
		if (!this.has(loc)) {
			return;
		}

		var previousObject = this._grid[loc.x][loc.y];

		// Remove the object at the specified location.
		delete this._grid[loc.x][loc.y];

		// Update the number of items in the specified column.
		this._colCounts[loc.x]--;

		// Update the global count.
		this._count--;

		// Clean up memory for the column if it is now empty.
		if (this._colCounts[loc.x] === 0) {
			delete this._grid[loc.x];
			delete this._colCounts[loc.x];
		}

		return previousObject;
	},

	_hasX: function(col) {
		return this._grid[col] !== undefined;
	},

	_createX: function(col) {
		this._grid[col] = {};
		this._colCounts[col] = 0;
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
