var BlockGridPadding = {
	// Extracts the minimum regular grid from a padded regular grid
	// Regular meaning all rows have same number of columns
	extractMinimumGrid: function(grid) {
		// Find the boundaries of the minimum grid within the padded grid
		if (grid[0] !== undefined) {
			var startCol = grid[0].length;
		} else {
			var startCol = 0;
		}
		
		var endCol = 0;
		var startRow = grid.length;
		var endRow = 0;

		var gridHasBlocks = false;
		for (var row = 0; row < grid.length; row++) {
			for (var col = 0; col < grid[row].length; col++) {
				if (grid[row][col] !== undefined) {
					gridHasBlocks = true;
					if (col < startCol)
						startCol = col;
					if (col > endCol)
						endCol = col;
					if (row < startRow)
						startRow = row;
					if (row > endRow)
						endRow = row;
				}
			}
		}

		// Make a new grid with the correct minimum boundaries
		var minGridRows = gridHasBlocks ? endRow - startRow + 1 : 0;
		var minGridCols = gridHasBlocks ? endCol - startCol + 1 : 0;
		var minGrid = new Array(minGridRows);
		for (var i = 0; i < minGridRows; i++) {
			minGrid[i] = new Array(minGridCols);
		}

		// Copy over to new minimum grid
		for (var i = 0; i < minGridRows; i++) {
			for (var j = 0; j < minGridCols; j++) {
				minGrid[i][j] = grid[i + startRow][j + startCol];
			}
		}

		return minGrid;

	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = BlockGridPadding;
}
