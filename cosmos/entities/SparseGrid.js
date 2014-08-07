var SparseGrid = IgeClass.extend({
	classId: 'SparseGrid',

	_count: undefined,
	_grid: undefined,

	init: function(data) {
		this._grid = {};
		this._count = 0;
		this._colCounts = {};
	},

	count: function() {
		return this._count;
	},

	each: function(func, loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			// If location is not provided, iterate over all items in the grid
			// TODO: Set loc, width, height so that all items are iterated over
			this.log("Invalid point passed to SparseGrid#each.", "warning");
		}

		for (var x = loc.x; x < loc.x + width; x++) {
			// If the specified column doesn't exist, then there's no reason to iterate over it
			if (!this._hasX(x)) {
				continue;
			}

			//console.log("SparseGrid#each: has x: " + x);

			for (var y = loc.y; y < loc.y + height; y++) {
				var object = this._grid[x][y];
				if (object !== undefined) {
					// func can return false to indicate that we should stop iterating
					if (func(object) === true) {
						return true;
					}
				}
			}
		}

		return false;
	},

	get: function(loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#get: no valid loc provided.", "warning");
			return;
		}

		// If no width and height are provided, just get the location provided.
		width = (width === undefined) ? 1 : width;
		height = (height === undefined) ? 1 : height;

		var objects = [];
		var objectsSet = {};

		this.each(function(object) {
			if (!objectsSet[object.id()]) {
				objectsSet[object.id()] = true;
				objects.push(object);
			}
		}, loc, width, height);

		return objects;
	},

	has: function(loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#has: no valid loc provided.", "warning");
			return false;
		}

		// If no width and height are provided, just check the location provided.
		width = (width === undefined) ? 1 : width;
		height = (height === undefined) ? 1 : height;

		// The each function will return true to indicate that it looped through everything and
		// false to indicate that it finished early (due to our stopping it).
		var brokeEarly = this.each(function(object) {
			//console.log("SparseGrid#has: object found: " + object.id());

			// Return true to stop the iterator early.
			return true;
		}, loc, width, height);

		// If we broke early, then it must have been because we found an object, so return true.
		// Otherwise, we didn't find any objects, so return false.
		return brokeEarly;
	},

	put: function(object, loc, replace) {
		if (object === undefined) {
			this.log("SparseGrid#put: no object parameter to put.", "warning");
			return;
		}

		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#put: no valid loc provided.", "warning");
			return;
		}

		if (replace === undefined) {
			this.log("SparseGrid#put: no replace value provided.", "warning");
			return;
		}

		var width = object.gridData.width;
		var height = object.gridData.height;

		var previousObjects = [];

		// Not allowed to replace blocks
		if (!replace) {
			// If there is are any blocks in the area that we want to occupy, we cannot place
			// because replacement is not allowed.
			if (this.has(loc, width, height)) {
				return null;
			}
		}
		// Allowed to replace blocks
		else {
			// Remove all of the objects currently occupying the area that we want to place in.
			previousObjects = this.remove(loc, width, height);
		}

		// Update the location of the object.
		object.gridData.loc = loc;

		// Place the object in the grid.
		this._setObject(object);

		return previousObjects;
	},

	remove: function(loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#remove: no valid loc provided.", "warning");
			return;
		}

		// If no width and height are provided, just remove the location provided.
		width = (width === undefined) ? 1 : width;
		height = (height === undefined) ? 1 : height;

		var previousObjects = this.get(loc, width, height);

		var self = this;
		_.forEach(previousObjects, function(previousObject) {
			self._unsetObject(previousObject);
		});

		return previousObjects;
	},

	toJSON: function() {

	},

	_createX: function(x) {
		this._grid[x] = {};
		this._colCounts[x] = 0;
	},

	_hasX: function(col) {
		return this._grid[col] !== undefined;
	},

	_set: function(object, x, y) {
		// If the specified column doesn't exist yet, create it because otherwise
		// grid[loc.x][loc.y] will throw an exception.
		if (!this._hasX(x)) {
			this._createX(x);
		}

		// TODO: Remove all commented out console.log statements.
		//console.log("SparseGrid#_set: object has been placed at location (" + x + ", " + y + ").");
		this._grid[x][y] = object;

		// Increase the col count for this x value so that we can tell when a grid column is empty.
		this._colCounts[x]++;
	},

	_setObject: function(object) {
		var x = object.gridData.loc.x;
		var y = object.gridData.loc.y;

		//console.log("SparseGrid#_setObject: object width: " + object.gridData.width +
		//	", object height: " + object.gridData.height + ".");

		// Loop through and place a reference to the object at each location it will occupy.
		for (var dx = 0; dx < object.gridData.width; dx++) {
			for (var dy = 0; dy < object.gridData.height; dy++) {
				//console.log("SparseGrid#_setObject: inner loop called.");
				this._set(object, x + dx, y + dy);
			}
		}

		// Update the global count.
		this._count++;
	},

	_unset: function(x, y) {
		// Remove the object at the specified location.
		delete this._grid[x][y];

		// Update the number of items in the specified column.
		this._colCounts[x]--;

		// Clean up memory for the column if it is now empty.
		if (this._colCounts[x] === 0) {
			delete this._grid[x];
			delete this._colCounts[x];
		}
	},

	_unsetObject: function(object) {
		var x = object.gridData.loc.x;
		var y = object.gridData.loc.y;

		// Loop through and unset all of the references to the object that we are removing.
		for (var dx = 0; dx < object.gridData.width; dx++) {
			for (var dy = 0; dy < object.gridData.height; dy++) {
				this._unset(x + dx, y + dy);
			}
		}

		// Update the global count.
		this._count--;
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
