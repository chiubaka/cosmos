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
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = BlockGridPadding;
}
