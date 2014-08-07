var GridLocation = function(col, row) {
	this.col = col;
	this.row = row;
};

GridLocation.copy = function(location) {
	return new GridLocation(location.col, location.row);
};

GridLocation.subtract = function(location1, location2) {
	return new GridLocation(location1.col - location2.col, location1.row - location2.row);
};

GridLocation.validateLocation = function(location) {
	return (location !== undefined && location.row !== undefined && location.col !== undefined);
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = GridLocation; }
