var SparseGrid = IgeClass.extend({
	classId: 'SparseGrid',

	_count: undefined,
	_grid: undefined,
	_lowerBound: undefined,
	/**
	 * Flag to indicate whether or not the SparseGrid is currently in the middle of a put operation.
	 * Helpful to differentiate whether or not remove was called directly or if it was the result
	 * of a put call.
	 */
	_putting: undefined,
	_upperBound: undefined,

	init: function(data) {
		this._grid = {};
		this._count = 0;
		this._colCounts = {};
		this._lowerBound = new IgePoint2d(0, 0);
		this._putting = false;
		this._upperBound = new IgePoint2d(0, 0);
	},

	count: function() {
		return this._count;
	},

	/*
	Loops through all of the blocks in a rectangle with upper left corner loc and dimensions width and height.
	Runs func on each block in this rectangle.
	*/
	each: function(func, loc, width, height) {
		if (typeof(func) !== "function") {
			this.log("SparseGrid#each: passed func value is not a function.", "warning");
			return null;
		}

		if (!IgePoint2d.validatePoint(loc)) {
			// If location is not provided, iterate over all items in the grid. This is a separate
			// loop because iterating over the keys is slightly more efficient in this case.
			for (var x in this._grid) {
				if (this._grid.hasOwnProperty(x)) {
					for (var y in this._grid[x]) {
						if (func(this._grid[x][y]) === true) {
							return true;
						}
					}
				}
			}
			return false;
		}

		if (width === undefined) {
			this.log("SparseGrid#each: no width parameter provided.", "warning");
			return null;
		}

		if (height === undefined) {
			this.log("SparseGrid#each: no height parameter provided.", "warning");
			return null;
		}

		for (var x = loc.x; x < loc.x + width; x++) {
			// If the specified column doesn't exist, then there's no reason to iterate over it
			if (!this._hasX(x)) {
				continue;
			}

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

	/**
	 * Given a {@link Block}, returns the neighboring locations to the {@link Block} that do not have other blocks.
	 * @param block {Block} The {@link Block} to get the emptying neighboring locations for.
	 * @returns {Array} A list of location objects, which are of the format {row: number, col: number}. Each location
	 * represents a location neighboring the given {@link Block} that did not have a neighbor.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	emptyNeighboringLocations: function(object) {
		var emptyNeighboringLocations = [];
		var neighboringLocations = this.neighboringLocationsForObject(object);

		var self = this;
		_.forEach(neighboringLocations, function(loc) {
			if (self.has(loc)) {
				emptyNeighboringLocations.push(loc);
			}
		});

		return emptyNeighboringLocations;
	},

	fromJSON: function(ObjectClass, json) {
		var self = this;
		_.forOwn(json, function(row, x) {
			_.forOwn(row, function(objectJSON, y) {
				var object = ObjectClass.fromJSON(objectJSON);
				self.put(object, object.gridData.loc, false);
			});
		});
	},

	get: function(loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#get: no valid loc provided.", "warning");
			return null;
		}

		// If no width and height are provided, just get the location provided.
		width = width || 1;
		height = height || 1;

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
		width = width || 1;
		height = height || 1;

		// The each function will return true to indicate that it looped through everything and
		// false to indicate that it finished early (due to our stopping it).
		var brokeEarly = this.each(function(object) {
			// Return true to stop the iterator early.
			return true;
		}, loc, width, height);

		// If we broke early, then it must have been because we found an object, so return true.
		// Otherwise, we didn't find any objects, so return false.
		return brokeEarly;
	},

	hasNeighbors: function(loc, width, height) {
		var neighboringLocations = this.neighboringLocations(loc, width, height);

		var ret = false;
		var self = this;
		_.forEach(neighboringLocations, function(neighboringLocation) {
			if (self.has(neighboringLocation)) {
				ret = true;
			}
		});
		return ret;
	},

	hasNeighboringOpenLocations: function(loc, width, height) {
		var neighboringOpenLocations = this.neighboringOpenLocations(loc, width, height);
		return neighboringOpenLocations.length > 0;
	},

	gridHeight: function() {
		if (this.count() === 0) {
			return 0;
		}
		return this._upperBound.y - this._lowerBound.y + 1;
	},

	gridWidth: function() {
		if (this.count() === 0) {
			return 0;
		}
		return this._upperBound.x - this._lowerBound.x + 1;
	},

	lowerBound: function() {
		return this._lowerBound.clone();
	},

	neighboringLocations: function(loc, width, height) {
		// TODO: Validate the location, width, and height.
		var neighboringLocations = [];

		width = width || 1;
		height = height || 1;

		var topY = loc.y - 1;
		var bottomY = loc.y + height;
		var leftX = loc.x - 1;
		var rightX = loc.x + width;

		for (var x = leftX + 1; x <= rightX - 1; x++) {
			neighboringLocations.push(new IgePoint2d(x, topY));
			neighboringLocations.push(new IgePoint2d(x, bottomY));
		}

		for (var y = topY + 1; y <= bottomY - 1; y++) {
			neighboringLocations.push(new IgePoint2d(leftX, y));
			neighboringLocations.push(new IgePoint2d(rightX, y));
		}

		return neighboringLocations;
	},

	neighboringLocationsForObject: function(object) {
		// TODO: Validate that the object has the GridData component.
		return this.neighboringLocations(object.gridData.loc, object.gridData.width,
			object.gridData.height);
	},

	neighboringOpenLocations: function(loc, width, height) {
		var neighboringLocations = this.neighboringLocations(loc, width, height);
		var neighboringOpenLocations = [];

		var self = this;
		_.forEach(neighboringLocations, function(neighboringLocation) {
			if (!self.has(neighboringLocation)) {
				neighboringOpenLocations.push(neighboringLocation);
			}
		});

		return neighboringOpenLocations;
	},

	neighboringOpenLocationsForObject: function(object) {
		return this.neighboringOpenLocations(object.gridData.loc);
	},

	objectHasNeighboringOpenLocations: function(object) {
		// TODO: Validate that the object has the GridData component.
		return this.hasNeighboringOpenLocations(object.gridData.loc, object.gridData.width,
			object.gridData.height);
	},

	put: function(object, loc, replace) {
		if (object === undefined) {
			this.log("SparseGrid#put: no object parameter to put.", "warning");
			return null;
		}

		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#put: no valid loc provided.", "warning");
			return null;
		}

		if (replace === undefined) {
			this.log("SparseGrid#put: no replace value provided.", "warning");
			return null;
		}

		if (!(object.gridData instanceof GridData)) {
			this.log("SparseGrid#put: object does not have grid data component.", "warning");
			return null;
		}

		if (object.gridData.grid !== undefined) {
			this.log("SparseGrid#put: attempt to add object that has already been added to a grid.",
				"warning");
			return null;
		}

		this._putting = true;

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
		object.gridData.grid = this;

		this._updateBoundsPut(object);

		// Place the object in the grid.
		this._setObject(object);

		this._putting = false;

		return previousObjects;
	},

	relativeLocation: function(loc) {
		return loc.minusPoint(this._lowerBound);
	},

	remove: function(loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("SparseGrid#remove: no valid loc provided.", "warning");
			return null;
		}

		// If no width and height are provided, just remove the location provided.
		width = width || 1;
		height = height || 1;

		var previousObjects = this.get(loc, width, height);

		var extremeBounds = {
			left: Number.MAX_VALUE,
			top: Number.MAX_VALUE,
			right: -Number.MAX_VALUE,
			bottom: -Number.MAX_VALUE
		};

		var self = this;
		_.forEach(previousObjects, function(previousObject) {
			self._unsetObject(previousObject);
			if (previousObject.onRemove) {
				previousObject.onRemove();
			}
			previousObject.gridData.grid = undefined;

			var bounds = previousObject.gridData.bounds();

			extremeBounds.left = Math.min(extremeBounds.left, bounds.left);
			extremeBounds.top = Math.min(extremeBounds.top, bounds.top);
			extremeBounds.right = Math.max(extremeBounds.right, bounds.right);
			extremeBounds.bottom = Math.max(extremeBounds.bottom, bounds.bottom);
		});

		this._updateBoundsRemove(extremeBounds);

		return previousObjects;
	},

	toJSON: function() {
		var objects = this.get(this._lowerBound, this.gridWidth(), this.gridHeight());

		var json = {};

		_.forEach(objects, function(object) {
			var loc = object.gridData.loc;
			if (json[loc.x] === undefined) {
				json[loc.x] = {};
			}

			json[loc.x][loc.y] = object.toJSON();
		});

		return json;
	},

	upperBound: function() {
		return this._upperBound.clone();
	},

	_createX: function(x) {
		this._grid[x] = {};
		this._colCounts[x] = 0;
	},

	_hasX: function(x) {
		return this._grid[x] !== undefined;
	},

	_set: function(object, x, y) {
		// If the specified column doesn't exist yet, create it because otherwise
		// grid[loc.x][loc.y] will throw an exception.
		if (!this._hasX(x)) {
			this._createX(x);
		}

		this._grid[x][y] = object;

		// Increase the col count for this x value so that we can tell when a grid column is empty.
		this._colCounts[x]++;
	},

	_setObject: function(object) {
		var x = object.gridData.loc.x;
		var y = object.gridData.loc.y;

		// Loop through and place a reference to the object at each location it will occupy.
		for (var dx = 0; dx < object.gridData.width; dx++) {
			for (var dy = 0; dy < object.gridData.height; dy++) {
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
	},

	_updateBoundsPut: function(object) {
		var left = object.gridData.loc.x;
		var top = object.gridData.loc.y;
		var right = left + object.gridData.width - 1;
		var bottom = top + object.gridData.height - 1;

		if (this.count() === 0) {
			this._lowerBound = object.gridData.loc.clone();
			this._upperBound = new IgePoint2d(right, bottom);
			return;
		}

		this._lowerBound.x = Math.min(this._lowerBound.x, left);
		this._lowerBound.y = Math.min(this._lowerBound.y, top);

		this._upperBound.x = Math.max(this._upperBound.x, right);
		this._upperBound.y = Math.max(this._upperBound.y, bottom);
	},

	_updateBoundsRemove: function(extremeBounds) {
		if (this.count() === 0) {
			return;
		}

		if (extremeBounds.left === this._lowerBound.x || extremeBounds.right === this._upperBound.x) {
			this._updateHorizontalBounds();
		}

		if (extremeBounds.top === this._lowerBound.y || extremeBounds.top === this._upperBound.y) {
			this._updateVerticalBounds();
		}
	},

	_updateHorizontalBounds: function() {
		this._upperBound.x = -Number.MAX_VALUE;
		this._lowerBound.x = Number.MAX_VALUE;
		var self = this;
		_.forOwn(this._grid, function(col, key) {
			var num = parseInt(key);
			self._upperBound.x = Math.max(self._upperBound.x, num);
			self._lowerBound.x = Math.min(self._lowerBound.x, num);
		});
	},

	_updateVerticalBounds: function() {
		this._upperBound.y = -Number.MAX_VALUE;
		this._lowerBound.y = Number.MAX_VALUE;
		var self = this;
		_.forOwn(this._grid, function(col, key) {
			_.forOwn(col, function(val, key) {
				var num = parseInt(key);
				self._upperBound.y = Math.max(self._upperBound.y, num);
				self._lowerBound.y = Math.min(self._lowerBound.y, num);
			});
		});
	}
});

SparseGrid.fromJSON = function(ObjectClass, json) {
	var grid = new SparseGrid();

	grid.fromJSON(ObjectClass, json);

	return grid;
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = SparseGrid; }
