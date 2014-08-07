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

		it("should be able to tell whether or not a given location is occupied.", function() {
			expect(this.grid.has(new IgePoint2d(0, 0))).toBe(false);
			this.grid.put(this.testObjects[0], new IgePoint2d(0, 0));
			expect(this.grid.has(new IgePoint2d(0, 0))).toBe(true);
		});

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

		it("should be able to handle negative values.", function() {
			this.grid.put(this.testObjects[0], new IgePoint2d(-1, -1));
			expect(this.grid.get(new IgePoint2d(-1, -1))).toBe(this.testObjects[0]);
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

		it("should be able to place objects of different dimensions.", function() {
			expect(true).toBe(false);
		});

		it("should have references to a large object at each location that it occupies.",
			function() {
				expect(true).toBe(false);
			}
		);

		it("should return null if an object is placed without replacement and any of the spaces " +
			"it would occupy is already occupied.",
			function() {
				expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(0, 0), false))
					.toBe(null);

				expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(1, 1), false))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(1, 1), false))
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

				expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(0, 0), false))
					.toContain([this.testObjects["1x1"]);

				expect(this.grid.put(this.testObjects["2x2"], new IgePoint2d(1, 1), false))
					.toEqual([]);
				expect(this.grid.put(this.testObjects["1x1"], new IgePoint2d(1, 1), false))
					.toEqual(null);
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
	});
};