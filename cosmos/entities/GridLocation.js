var GridLocation = function(col, row) {
	this.col = col;
	this.row = row;
};

GridLocation.copy = function(location) {
	if (!GridLocation.validateLocation(location)) {
		console.warn("Invalid location passed to GridLocation#copy.");
		return;
	}

	return new GridLocation(location.col, location.row);
};

GridLocation.subtract = function(location1, location2) {
	if (!GridLocation.validateLocation(location1)) {
		console.warn("Location 1 passed to GridLocation#subtract is invalid.");
		return;
	}

	if (!GridLocation.validateLocation(location2)) {
		console.warn("Location 2 passed to GridLocation#subtract is invalid.");
		return;
	}

	return new GridLocation(location1.col - location2.col, location1.row - location2.row);
};

GridLocation.validateLocation = function(location) {
	return (location !== undefined && location.row !== undefined && location.col !== undefined);
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = GridLocation; }
