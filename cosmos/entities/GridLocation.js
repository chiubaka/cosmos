var GridLocation = function(col, row) {
	this.col = col;
	this.row = row;
};

GridLocation.validateLocation = function(location) {
	return (location !== undefined && location.row !== undefined && location.col !== undefined);
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = GridLocation; }
