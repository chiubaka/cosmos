// TODO: Find and replace BlockGridNew with BlockGrid once this class completely takes the place of the old BlockGrid.

var BlockGridNew = IgeEntityBox2d.extend({
	classId: "BlockGridNew",

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		// TODO: Create Box2dBody.

		// TODO: Finish BlockGridNew initialization.
	},

	add: function(block, location) {
		// Validate parameters
		if (!block) {
			this.log("Invalid block passed to BlockGridNew#add.", "error");
			return;
		}
		if (!GridLocation.validateLocation(location)) {
			this.log("Invalid location passed to BlockGridNew#add.", "error");
			return;
		}

		// TODO: Add the block at the specified location.
	},

	each: function(action) {
		// TODO: Call action with each block as a parameter. This is effectively an iterator.
	},

	get: function(location) {
		// Validate parameters
		if (!GridLocation.validateLocation(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "error");
			return;
		}

		// TODO: Return the block at the specified location.
	},

	remove: function(location) {
		// Validate parameters
		if (!GridLocation.validateLocation(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "error");
			return;
		}

		// TODO: Remove the block at the specified location.
	},

	_validLocation: function(location) {
		return location && location.row && location.col;
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = BlockGridNew; }
