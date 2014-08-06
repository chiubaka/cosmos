var SparseGrid = function() {
	var grid = {};

	this.add = function(object, location) {
		if (object === undefined) {
			console.warn("SparseGrid#add: no object parameter to add.");
			return;
		}
		if (!GridLocation.validateLocation(location)) {
			console.warn("SparseGrid#add: no location provided.");
			return;
		}
	};

	this.get = function(location) {
		if (!GridLocation.validateLocation(location)) {
			console.warn("SparseGrid#get: no location provided.");
			return;
		}
	};

	this.remove = function(location) {
		if (!GridLocation.validateLocation(location)) {
			console.warn("SparseGrid#remove: no location provided.");
			return;
		}
	};
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
