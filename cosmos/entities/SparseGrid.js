var SparseGrid = function() {
	var grid = {};
	var colCounts = {};

	this.add = function(object, loc) {
		if (object === undefined) {
			console.warn("SparseGrid#add: no object parameter to add.");
			return;
		}
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#add: no valid loc provided.");
			return;
		}

		// If the specified column doesn't exist yet, create it because otherwise
		// grid[loc.col][loc.row] will throw an exception.
		if (!hasCol(loc.col)) {
			createCol(loc.col);
		}

		// Place the object at the specified location in the grid.
		grid[loc.col][loc.row] = object;

		// Update the number of items in the specified column.
		colCounts[loc.col]++;
	};

	this.get = function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#get: no valid loc provided.");
			return;
		}

		// If the specified column doesn't exist, then grid[loc.col][loc.row] will throw an
		// exception so just return.
		if (!hasCol(loc.col)) {
			return;
		}

		return grid[loc.col][loc.row];
	};

	this.has = function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#has: no valid loc provided.");
			return;
		}

		return hasCol(loc.col) && grid[loc.col][loc.row] !== undefined;
	};

	this.remove = function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#remove: no valid loc provided.");
			return;
		}

		// If we don't have anything at the specified location, there's nothing to do.
		if (!this.has(loc)) {
			return;
		}

		// Remove the object at the specified location.
		delete grid[loc.col][loc.row];

		// Update the number of items in the specified column.
		colCounts[loc.col]--;

		// Clean up memory for the column if it is now empty.
		if (colCounts[loc.col] === 0) {
			delete grid[loc.col];
			delete colCounts[loc.col];
		}
	};
[]
	function hasCol(col) {
		return grid[col] !== undefined;
	}

	function createCol(col) {
		grid[col] = {};
		colCounts[col] = 0;
	}
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
