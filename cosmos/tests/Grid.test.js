/**
 * Tests an object that has the Grid interface. If no before or after function is provided, it is
 * expected that the parent describe sets up all of the necessary test objects.
 * @param GridClass {Object} The object for the GridClass.
 * @param TestGridObject {Object} The object for the TestGridObject.
 */
var testGrid = function(GridClass, TestGridObject) {
	describe("implementing the Grid interface", function() {
		describe("should have public interface functions that fails gracefully", function() {
			beforeEach(function() {
				TestUtils.disableLogging();
			});

			afterEach(function() {
				TestUtils.enableLogging();
			});

			it("when an invalid function is passed to the each function.", function() {
				this.grid.each();
				this.grid.each({});
			});

			it("when no location is passed to the each function.", function() {
				this.grid.each(function() {}, undefined, 4, 4);
			});

			it("when no width is passed to the each function.", function() {
				this.grid.each(function() {}, new IgePoint2d(0, 0), undefined, 4);
			});

			it("when no height is passed to the each function.", function() {
				this.grid.each(function() {}, new IgePoint2d(0, 0), 4, undefined);
			});

			it("when no object is passed to the put function.", function() {
				this.grid.put(undefined, new IgePoint2d(0, 0), true);
			});

			it("when no location is passed to the put function.", function() {
				this.grid.put(this.testObjects["1x1"][0], undefined, true);
			});

			it("when no replace value is passed to the put function.", function() {
				this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0));
			});

			it("when a location without the GridData component is passed to the put function.",
				function() {
					this.testObjects["1x1"][0].gridData = undefined;
					this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), true);
				}
			);

			it("when no location is passed to the get function.", function() {
				this.grid.get(undefined);
			});

			it("when no width is passed to the get function.", function() {
				this.grid.get(new IgePoint2d(0, 0), undefined, 4);
			});

			it("when no height is passed to the get function.", function() {
				this.grid.get(new IgePoint2d(0, 0), 4, undefined);
			});

			it("when no location is passed to the has function.", function() {
				this.grid.has(undefined);
			});

			it("when no width is passed to the has function.", function() {
				this.grid.has(new IgePoint2d(0, 0), undefined, 4);
			});

			it("when no height is passed to the has function.", function() {
				this.grid.has(new IgePoint2d(0, 0), 4, undefined);
			});

			it("when no location is passed to the remove function.",
				function() {
					this.grid.remove(undefined);
				}
			);

			it("when no width is passed to the remove function.",
				function() {
					this.grid.remove(new IgePoint2d(0, 0), undefined, 3);
				}
			);

			it("when no height is passed to the remove function.",
				function() {
					this.grid.remove(new IgePoint2d(0, 0), 3, undefined);
				}
			);
		});

		it("should be able to put objects inside of itself.", function() {
			expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false))
				.toEqual([]);
			expect(this.grid.get(new IgePoint2d(0, 0))).toEqual([this.testObjects["1x1"][0]]);
			expect(this.grid.count()).toEqual(1);

			expect(this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(10, 10), false))
				.toEqual([]);
			for (var x = 10; x < 12; x++) {
				for (var y = 10; y < 12; y++) {
					expect(this.grid.get(new IgePoint2d(x, y))).toEqual([this.testObjects["2x2"][0]]);
				}
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
					expect(this.grid.get(new IgePoint2d(x, y))).toEqual([this.testObjects["2x2"][0]]);
				}
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
				expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(10, 10), true))
					.toEqual([]);

				expect(this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(-10, -10), false))
					.toEqual([]);
			}
		);

		it("should return an empty list when removing from a location that is unoccupied.",
			function() {
				expect(this.grid.remove(new IgePoint2d(0, 0))).toEqual([]);
			}
		);

		it("should report that a location is unoccupied if asked about an invalid location.",
			function() {
				TestUtils.disableLogging();
				expect(this.grid.has()).toBe(false);
				TestUtils.enableLogging();
			}
		);

		describe("should be time efficient", function() {
			var NUM_ITERATIONS = 1000;
			var json;

			it("when adding objects in a row.", function() {
				var start = +new Date();//.getTime();
				for (var x = 0; x < NUM_ITERATIONS; x++) {
					this.grid.put(new TestGridObject(1, 1), new IgePoint2d(x, 0), false);
				}
				var end = +new Date();//.getTime();
				var diff = end - start;
				var averageTime = diff / NUM_ITERATIONS;

				console.log(averageTime);
				expect(averageTime).toBeLessThan(1);
			});

			it("when adding objects in a column.", function() {
				var start = +new Date();//.getTime();
				for (var y = 0; y < NUM_ITERATIONS; y++) {
					this.grid.put(new TestGridObject(1, 1), new IgePoint2d(0, y), false);
				}
				var end = +new Date();//.getTime();
				var diff = end - start;
				var averageTime = diff / NUM_ITERATIONS;

				console.log(averageTime);
				expect(averageTime).toBeLessThan(1);
			});

			it("when adding objects along a diagonal.", function() {
				var start = +new Date();//.getTime();
				for (var i = 0; i < NUM_ITERATIONS; i++) {
					this.grid.put(new TestGridObject(1, 1), new IgePoint2d(i, i), false);
				}
				var end = +new Date();//.getTime();
				var diff = end - start;
				var averageTime = diff / NUM_ITERATIONS;

				console.log(averageTime);
				expect(averageTime).toBeLessThan(1);
			});

			it("when serializing to JSON.", function() {
				for (var x = 0; x < 500; x++) {
					this.grid.put(new TestGridObject(1, 1), new IgePoint2d(x, 0), false);
				}

				var start = +new Date();//.getTime();
				for (var i = 0; i < NUM_ITERATIONS; i++) {
					json = this.grid.toJSON();
				}
				var end = +new Date();//.getTime();
				var diff = end - start;
				var averageTime = diff / NUM_ITERATIONS;
				console.log(averageTime);
				expect(averageTime).toBeLessThan(8);
			});

			it("when deserializing from JSON.", function() {
				var start = +new Date();//.getTime();
				for (var i = 0; i < NUM_ITERATIONS; i++) {
					GridClass.fromJSON(TestGridObject, json);
				}
				var end = +new Date();//.getTime();
				var diff = end - start;
				var averageTime = diff / NUM_ITERATIONS;
				console.log(averageTime);
				expect(averageTime).toBeLessThan(8);
			});
		});
	});
};