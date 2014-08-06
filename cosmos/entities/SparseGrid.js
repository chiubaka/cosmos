var SparseGrid = function() {
	var grid = {};

	this.add = function(object, loc) {
		if (object === undefined) {
			console.warn("SparseGrid#add: no object parameter to add.");
			return;
		}
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#add: no loc provided.");
			return;
		}

		// If the specified column doesn't exist yet, create it because otherwise
		// grid[loc.col][loc.row] will throw an exception.
		if (!hasCol(loc.col)) {
			createCol(loc.col);
		}

		grid[loc.row][loc.col] = object;
	};

	this.get = function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#get: no loc provided.");
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
			console.warn("SparseGrid#has: no loc provided.");
			return;
		}

		return hasCol(loc.col) && grid[loc.col][loc.row] !== undefined;
	};

	this.remove = function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#remove: no loc provided.");
			return;
		}

		// If we don't have anything at the specified location, there's nothing to do.
		if (!this.has(loc)) {
			return;
		}

		delete grid[loc.col][loc.row];

		// TODO: If a column is empty after deleting an element at a given row, we should delete the
		// column to recover some space.
	};

	function hasCol(col) {
		return grid[col] !== undefined;
	}

	function createCol(col) {
		grid[col] = {};
	}
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
