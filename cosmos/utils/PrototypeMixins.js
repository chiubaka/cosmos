/**
 * Remove an item or group of items from an array
 * @example
 *      // Remove the second item from the array
 *       array.remove(1);
 *      // Remove the second-to-last item from the array
 *      array.remove(-2);
 *      // Remove the second and third items from the array
 *      array.remove(1,2);
 *      // Remove the last and second-to-last items from the array
 *      array.remove(-2,-1);
 * @param from {Integer} From index, inclusive
 * @param to {Integer} To index, inclusive
 * @returns {Integer} The new array length
 * @memberof Array
 * Referenced from http://ejohn.org/blog/javascript-array-remove/
 */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/* Our custom array functions */

/**
 * Gets an item from a 2d array. Returns undefined if out of bounds.
 * @param row {Integer}
 * @param col {Integer}
 * @returns {*} Item at row, col
 * @memberof Array
 */
Array.prototype.get2D = function(row, col) {
	if (row < 0 || col < 0) {
		return undefined;
	}
	if (row >= this.length) {
		return undefined;
	}
	if (col >= this[row].length) {
		return undefined;
	}

	return this[row][col];
};

/**
 * Safely checks to see if a (row, col) is in bounds.
 * @param row {Integer}
 * @param col {Integer}
 * @returns {Boolean} True if (row, col) is in bounds
 * @memberof Array
 */
Array.prototype.is2DInBounds = function (row, col) {
	if ((row < 0) || (col < 0)) {
		return false;
	}

	var maxRowLength = this.length;
	if (row < maxRowLength) {
		if (this[row] === undefined) {
			return false;
		}
		var maxColLength = this[row].length;
		if (col < maxColLength) {
			return true;
		}
	}
	return false;
};

/**
 * Creates a new 2D array with specified dimensions and fills it
 *  with data. If data is undefined, fill with undefined.
 * @param numRows {Integer} Number of rows in new 2D array
 * @param numCols {Integer} Number of cols in new 2D array
 * @param data {*=} Optional array fill parameter
 * @returns {Array} Newly created 2D array
 * @memberof Array
 */

Array.prototype.new2DArray = function(numRows, numCols, data) {
	var grid = [];

	for (x = 0; x < numRows; x++) {
		var gridCol = [];
		for (y = 0; y < numCols; y++) {
			gridCol.push(data);
		}
		grid.push(gridCol);
	}

	return grid;
};

/**
 * Gets the maximum row length because javascript 2D arrays are jagged
 * @returns {Integer} Maximum row length of a 2D array
 * @memberof Array
 */
Array.prototype.get2DMaxRowLength = function() {
	var maxRowLength = 0;
	for (var row = 0; row < this.length; row++) {
		if (this[row].length > maxRowLength) {
			maxRowLength = this[row].length;
		}
	}

	return maxRowLength;
};
