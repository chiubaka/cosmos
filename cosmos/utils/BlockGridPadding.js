var BlockGridPadding = {

	// Pads a 2D array with padAmount of undefines on all sides
	padGrid: function(oldArr, padAmount) {
		var oldArrHeight = oldArr.length;
		var oldArrWidth = oldArr.get2DMaxRowLength();

		var paddedHeight = oldArrHeight + 2 * padAmount;
		var paddedWidth = oldArrWidth + 2 * padAmount;

		// Create the blank array
		var newArr = new Array(paddedHeight);
		for (var i = 0; i < paddedHeight; i++) {
			newArr[i] = new Array(paddedWidth);
		}

		// Copy old array into larger blank array
		for (var i = 0; i < oldArrHeight; i++) {
			for (var j = 0; j < oldArrWidth; j++) {
				var block = oldArr[i][j];
				if (block === undefined) {
					continue;
				}
				newArr[i + padAmount][j + padAmount] = block;
				block.row(i + padAmount).col(j + padAmount);
			}
		}

		return newArr;
	},

	// Extracts a 1x1 array from a padded 2D array
	extract1x1: function(array) {
		var coordinate = (array.length - 1) / 2;
		return array[coordinate][coordinate];
	},

	// Extracts the minimum regular grid from a padded regular grid
	// Regular meaning all rows have same number of columns
	extractMinimumGrid: function(grid) {
		// Find the boundaries of the minimum grid within the padded grid
		var startCol = grid[0].length;
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
