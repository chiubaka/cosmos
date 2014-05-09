/**
 * Referenced from http://ejohn.org/blog/javascript-array-remove/
 */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/* Our custom array functions */

// Gets an item from a 2d array. Returns undefined if out of bounds.
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

Array.prototype.is2DInBounds = function (row, col) {
	var maxRowLength = this.length;
	if (row < maxRowLength) {
		var maxColLength = this[row].length;
		if (col < maxColLength) {
			return true;
		}
	}
	return false;
};

// Creates a new 2D array with specified dimensions and fills it
// with data. If data is undefined, fill with undefined.
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

// Gets the maximum row length because javascript 2D arrays are jagged
Array.prototype.get2DMaxRowLength = function() {
	var maxRowLength = 0;
	for (var row = 0; row < this.length; row++) {
		if (this[row].length > maxRowLength) {
			maxRowLength = this[row].length;
		}
	}

	return maxRowLength;
};
