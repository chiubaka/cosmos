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

		if (!hasRowInCol(loc)) {
			createRowInCol(loc);
		}

		grid[loc.row][loc.col] = object;
	};

	this.get = function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#get: no loc provided.");
			return;
		}
		if (!hasCol(loc.col) || !hasRowInCol(loc)) {
			return;
		}

		return grid[loc.col][loc.row];
	};

	this.remove = function(loc) {
		if (!GridLocation.validateLocation(loc)) {
			console.warn("SparseGrid#remove: no loc provided.");
			return;
		}
	};

	function hasRowInCol(loc) {
		return grid[loc.col] !== undefined && grid[loc.col][loc.row] !== undefined;
	}

	function createRowInCol(loc) {
		if (!hasCol(loc.col)) {
			createCol(loc.col);
		}

		grid[loc.col][loc.row] = {};
	}

	function hasCol(col) {
		return grid[col] !== undefined;
	}

	function createCol(col) {
		grid[col] = {};
	}
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
