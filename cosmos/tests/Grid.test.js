/**
 * Tests an object that has the Grid interface.
 * @param beforeEachFunc {function} The function to run before each Grid interface test. This
 * function must, at minimum, create an object and assign it to this.grid and assign an array of
 * objects to this.testObjects.
 * @param afterEachFunc {function} The function to run after each Grid interface test.
 */
var testGrid = function(beforeEachFunc, afterEachFunc) {
	describe("implementing the Grid interface", function() {
		beforeEach(beforeEachFunc);
		afterEach(afterEachFunc);

		/*(describe("should have public interface functions that fails gracefully", function() {
			beforeEach(function() {
				TestUtils.disableLogging();
			});

			afterEach(function() {
				TestUtils.enableLogging();
			});

			it("when no object is passed to the put function.", function() {
				this.grid.put(undefined, new IgePoint2d(0, 0));
			});

			it("when no location is passed to the put function.", function() {
				this.grid.put(this.testObjects[0], undefined);
			});

			it("when no location is passed to the get function.", function() {
				this.grid.get(undefined);
			});

			it("when no location is passed to the has function.", function() {
				this.grid.has(undefined);
			});

			it("when no location is passed to the remove function.",
				function() {
					this.grid.remove(undefined);
				}
			);
		});

		it("should return undefined if asked to retrieve an object at a location that is " +
			"unoccupied.",
			function() {
				expect(this.grid.get(new IgePoint2d(10, 10))).not.toBeDefined();
			}
		);

		it("should report that a location is unoccupied if asked about an invalid location.",
			function() {
				TestUtils.disableLogging();
				expect(this.grid.has()).toBe(false);
				TestUtils.enableLogging();
			}
		);

		it("should be able to retrieve an object that has been placed in it.", function() {
			this.grid.put(this.testObjects[0], new IgePoint2d(0, 0));
			expect(this.grid.get(new IgePoint2d(0, 0))).toBe(this.testObjects[0]);
		});

		it("should return the previous object if remove is called on an occupied location.",
			function() {
				this.grid.put(this.testObjects[0], new IgePoint2d(0, 0));
				this.grid.put(this.testObjects[1], new IgePoint2d(0, 1));
				expect(this.grid.remove(new IgePoint2d(0, 0))).toBe(this.testObjects[0]);
				expect(this.grid.remove(new IgePoint2d(0, 1))).toBe(this.testObjects[1]);
			}
		);

		it("should not be able to retrieve an object that has been removed from it.", function() {
			this.grid.put(this.testObjects[0], new IgePoint2d(0, 0));
			expect(this.grid.get(new IgePoint2d(0, 0))).toBe(this.testObjects[0]);
			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.get(new IgePoint2d(0, 0))).not.toBeDefined();
		});

		it("should do nothing if asked to remove an object at an unoccupied location.", function() {
			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(0);
		});

		it("should keep track of the number of objects it contains.", function() {
			expect(this.grid.count()).toBe(0);
			this.grid.put(this.testObjects[0], new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(1);
			this.grid.put(this.testObjects[0], new IgePoint2d(0, 1));
			expect(this.grid.count()).toBe(2);
			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(1);
			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(1);
			this.grid.remove(new IgePoint2d(0, 1));
			expect(this.grid.count()).toBe(0);
		});

		it("should replace the existing object and return it if asked to place an object at an" +
			"occupied location",
			function() {
				this.grid.put(this.testObjects[0], new IgePoint2d(0, 0));
				expect(this.grid.put(this.testObjects[1], new IgePoint2d(0, 0)))
					.toBe(this.testObjects[0]);
				expect(this.grid.get(new IgePoint2d(0, 0))).toBe(this.testObjects[1]);
			}
		);

		it("should be able to handle hundreds of objects.", function() {
			// Num objects must be even or the test will break.
			var numObjects = 100;

			// Add numObjects objects to the grid.
			for (var i = 0; i < numObjects; i++) {
				var object = this.testObjects[i % this.testObjects.length];
				this.grid.put(object, new IgePoint2d(i, i));
			}
			expect(this.grid.count()).toBe(numObjects);

			// Remove every other object.
			for (var i = 0; i < numObjects; i += 2) {
				this.grid.remove(new IgePoint2d(i, i));
			}
			expect(this.grid.count()).toBe(numObjects / 2);

			// Check that the remaining locations are still filled.
			for (var i = 1; i < numObjects; i += 2) {
				var object = this.testObjects[i % this.testObjects.length];
				expect(this.grid.get(new IgePoint2d(i, i))).toBe(object);
			}

			// Check that the remove objects really were removed.
			for (var i = 0; i < numObjects; i += 2) {
				expect(this.grid.get(new IgePoint2d(i, i))).not.toBeDefined();
			}
		});*/

		it("should be able to put objects inside of itself.", function() {
			expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false))
				.toEqual([]);
			expect(this.grid._grid[0][0]).toBe(this.testObjects["1x1"][0]);
			expect(this.grid._colCounts[0]).toEqual(1);
			expect(this.grid.count()).toEqual(1);

			expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(10, 10), false))
				.toEqual([]);
			for (var x = 10; x < 12; x++) {
				for (var y = 10; y < 12; y++) {
					expect(this.grid._grid[x][y]).toBe(this.testObjects["2x2"][0]);
				}
				expect(this.grid._colCounts[x]).toEqual(2);
				expect(this.grid._colCounts[x]).toEqual(2);
			}
			expect(this.grid.count()).toEqual(2);
		});

		it("should be able to place objects of different dimensions.", function() {
			// Try a 1x1 object
			expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(10, 9), false))
				.toEqual([]);

			// Try a 2x2 object
			expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 90), false))
				.toEqual([]);

			// Try a 3x3 object
			expect(this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(1000, 900), false))
				.toEqual([]);
		});

		it("should be able to handle negative values.", function() {
			expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(-5, -3), false))
				.toEqual([]);

			for (var x = -5; x < -3; x++) {
				for (var y = -3; y < -1; y++) {
					expect(this.grid._grid[x][y]).toBe(this.testObjects["2x2"][0]);
				}
				expect(this.grid._colCounts[x]).toEqual(2);
				expect(this.grid._colCounts[x]).toEqual(2);
			}
			expect(this.grid.count()).toEqual(1);
		});

		it("should be able to tell whether or not a given location is occupied.", function() {
			expect(this.grid.has(new IgePoint2d(0, 0))).toBe(false);
			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false);
			expect(this.grid.has(new IgePoint2d(0, 0))).toBe(true);
		});

		it("should be able to tell whether or not a given area is occupied.", function() {
			// Check if this works in the simple case.
			expect(this.grid.has(new IgePoint2d(0, 0), 2, 2)).toBe(false);
			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(1, 1), false);
			expect(this.grid.has(new IgePoint2d(0, 0), 2, 2)).toBe(true);

			// Check if this works with negative values.
			expect(this.grid.has(new IgePoint2d(-6, -6), 2, 2)).toBe(false);
			this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(-5, -6), false);
			expect(this.grid.has(new IgePoint2d(-6, -6), 2, 2)).toBe(true);

			// Check if this function works even if only the top-left corner of a larger block is in
			// the area.
			expect(this.grid.has(new IgePoint2d(4, 4), 2, 2)).toBe(false);
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(5, 5), false);
			expect(this.grid.has(new IgePoint2d(4, 4), 2, 2)).toBe(true);

			// Check if this function works even if only the bottom-right corner of a larger block
			// is in the area.
			expect(this.grid.has(new IgePoint2d(8, 8), 2, 2)).toBe(false);
			this.grid.put(this.testObjects["2x2"][1], new IgePoint2d(7, 7), false);
			expect(this.grid.has(new IgePoint2d(8, 8), 2, 2)).toBe(true);
		});

		it("should have references to a large object at each location that it occupies.",
			function() {
				expect(this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(10, 10), false))
					.toEqual([]);
				for (var x = 10; x < 13; x++) {
					for (var y = 10; y < 13; y++) {
						expect(this.grid._grid[x][y]).toBe(this.testObjects["3x3"][0]);
					}
					expect(this.grid._colCounts[x]).toEqual(3);
					expect(this.grid._colCounts[x]).toEqual(3);
				}
				expect(this.grid.count()).toEqual(1);
			}
		);

		it("should be able to retrieve objects that have been placed inside of it.", function() {
			expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(5, 5), false))
				.toEqual([]);
			expect(this.grid.get(new IgePoint2d(5, 5)))
				.toEqual([this.testObjects["1x1"][0]]);
		});

		it("should retrieve the same object for each location that a large object occupies.",
			function() {
				expect(this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(10, 10), false))
					.toEqual([]);
				for (var x = 10; x < 13; x++) {
					for (var y = 10; y < 13; y++) {
						expect(this.grid.get(new IgePoint2d(x, y)))
							.toEqual([this.testObjects["3x3"][0]]);
					}
					expect(this.grid._colCounts[x]).toEqual(3);
					expect(this.grid._colCounts[x]).toEqual(3);
				}
				expect(this.grid.count()).toEqual(1);
			}
		);

		it("should be able to retrieve objects within a given area.", function() {
			expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(5, 5), false))
				.toEqual([]);
			expect(this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(5, 6), false))
				.toEqual([]);
			expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(6, 6), false))
				.toEqual([]);

			expect(this.grid.get(new IgePoint2d(5, 5), 2, 2)).
				toEqual([
					this.testObjects["1x1"][0],
					this.testObjects["1x1"][1],
					this.testObjects["2x2"][0]
				]);

			expect(this.grid.get(new IgePoint2d(6, 6), 2, 2)).
				toEqual([
					this.testObjects["2x2"][0]
				]);

			expect(this.grid.get(new IgePoint2d(4, 4), 2, 2)).
				toEqual([
					this.testObjects["1x1"][0]
				]);
		});

		it("should not return duplicates of a large object within a given area.", function() {
			expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(5, 5), false))
				.toEqual([]);

			expect(this.grid.get(new IgePoint2d(5, 5), 2, 2)).
				toEqual([
					this.testObjects["2x2"][0]
				]);
		});

		it("should not be able to retrieve an object that has been removed from it.", function() {
			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), true);
			expect(this.grid.get(new IgePoint2d(0, 0))).toEqual([this.testObjects["1x1"][0]]);
			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.get(new IgePoint2d(0, 0))).toEqual([]);
		});

		it("should erase references to removed objects.", function() {
			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), true);
			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid._grid[0]).not.toBeDefined();

		});

		it("should do nothing if asked to remove an object at an unoccupied location.", function() {
			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(0);
		});

		it("should keep track of the number of objects it contains.", function() {
			expect(this.grid.count()).toBe(0);

			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false);
			expect(this.grid.count()).toBe(1);

			this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(0, 1), false);
			expect(this.grid.count()).toBe(2);

			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(1);

			expect(this.grid.get(new IgePoint2d(0, 0))).toEqual([]);

			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(1);

			this.grid.remove(new IgePoint2d(0, 1));
			expect(this.grid.count()).toBe(0);
		});

		it("should count correctly when a removal does nothing.", function() {
			expect(this.grid.count()).toBe(0);
			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false);
			expect(this.grid.count()).toBe(1);

			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(0);

			this.grid.remove(new IgePoint2d(0, 0));
			expect(this.grid.count()).toBe(0);
		});

		it("should refuse to add an object if that object has already been added to a grid.",
			function() {
				TestUtils.disableLogging();

				this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(5, 0), false);
				expect(this.grid.get(new IgePoint2d(5, 0))).toEqual([this.testObjects["1x1"][0]]);

				this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(6, 0), false);
				expect(this.grid.get(new IgePoint2d(6, 0))).toEqual([]);

				this.grid.remove(new IgePoint2d(5, 0));
				expect(this.grid.get(new IgePoint2d(5, 0))).toEqual([]);

				this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(10, 10), false);
				expect(this.grid.get(new IgePoint2d(10, 10))).toEqual([this.testObjects["1x1"][0]]);

				TestUtils.enableLogging();
			}
		);

		it("should return null if an object is placed without replacement and any of the spaces " +
			"it would occupy is already occupied.",
			function() {
				expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(0, 0), false))
					.toBe(null);

				expect(this.grid.put(this.testObjects["2x2"][1], new IgePoint2d(1, 1), false))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(1, 1), false))
					.toEqual(null);
			}
		);

		it("should return a list of replaced objects if an object is placed with replacement and " +
			"any of the spaces it would occupy is already occupied.",
			function() {
				expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), true))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(1, 0), true))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["1x1"][2], new IgePoint2d(1, 1), true))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["1x1"][3], new IgePoint2d(0, 1), true))
					.toEqual([]);

				var displaced = this.grid.put(
					this.testObjects["2x2"][0],
					new IgePoint2d(0, 0),
					true
				);

				var self = this;
				_.forEach(this.testObjects["1x1"], function(obj) {
					expect(displaced).toContain(obj);
				});
			}
		);

		it("should return an empty list if an object is placed successfully without displacing " +
				"any other objects.",
			function() {

			}
		);

		it("should clear all locations that an object occupied when that object is removed.",
			function() {

			}
		);

		it("should clear all locations that displaced objects occupied when a new object is " +
			"added.",
			function() {

			}
		);

		xit("should be able to handle hundreds of objects.", function() {
			// Num objects must be even or the test will break.
			var numObjects = 100;

			// Add numObjects objects to the grid.
			for (var i = 0; i < numObjects; i++) {
				var object = this.testObjects[i % this.testObjects.length];
				this.grid.put(object, new IgePoint2d(i, i));
			}
			expect(this.grid.count()).toBe(numObjects);

			// Remove every other object.
			for (var i = 0; i < numObjects; i += 2) {
				this.grid.remove(new IgePoint2d(i, i));
			}
			expect(this.grid.count()).toBe(numObjects / 2);

			// Check that the remaining locations are still filled.
			for (var i = 1; i < numObjects; i += 2) {
				var object = this.testObjects[i % this.testObjects.length];
				expect(this.grid.get(new IgePoint2d(i, i))).toBe(object);
			}

			// Check that the remove objects really were removed.
			for (var i = 0; i < numObjects; i += 2) {
				expect(this.grid.get(new IgePoint2d(i, i))).not.toBeDefined();
			}
		});
	});
};