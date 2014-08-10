var TestGridObject = IgeEntity.extend({
	classId: 'TestGridObject',

	value: undefined,

	init: function(width, height, value) {
		IgeEntity.prototype.init.call(this);
		this.addComponent(GridData, {width: width, height: height});

		if (value !== undefined) {
			this.value = value;
		}
		else {
			this.value = Math.floor(Math.random() * 100000) + 1;
		}
	},

	toJSON: function() {
		return {
			value: this.value,
			gridData: this.gridData.toJSON()
		}
	}
});

TestGridObject.fromJSON = function(json) {
	var object = new TestGridObject(json.gridData.width, json.gridData.height, json.value);
	object.gridData.loc = new IgePoint2d(json.gridData.loc.x, json.gridData.loc.y);
	return object;
}

describe("A SparseGrid", function() {
	function beforeEachFunc() {
		this.grid = new SparseGrid();
		this.testObjects = {};
		this.testObjects["1x1"] = [
			new TestGridObject(1, 1),
			new TestGridObject(1, 1),
			new TestGridObject(1, 1),
			new TestGridObject(1, 1)
		];
		this.testObjects["2x2"] = [
			new TestGridObject(2, 2),
			new TestGridObject(2, 2),
			new TestGridObject(2, 2),
			new TestGridObject(2, 2)
		];
		this.testObjects["3x3"] = [
			new TestGridObject(3, 3),
			new TestGridObject(3, 3),
			new TestGridObject(3, 3),
			new TestGridObject(3, 3)
		];
	};

	beforeEach(beforeEachFunc);

	testGrid(SparseGrid, TestGridObject);

	it("should have undefined column counts for empty columns.", function() {
		expect(this.grid._colCounts[0]).not.toBeDefined();
		expect(this.grid._colCounts[100]).not.toBeDefined();
		expect(this.grid._colCounts[-100]).not.toBeDefined();
	});

	it("should update column counts when objects are added.", function() {
		this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(10, 9), true);
		expect(this.grid._colCounts[10]).toEqual(1);

		this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(10, 10), true);
		expect(this.grid._colCounts[10]).toEqual(4);
		expect(this.grid._colCounts[11]).toEqual(3);
		expect(this.grid._colCounts[12]).toEqual(3);
	});

	it("should update column counts when objects are removed.", function() {
		this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(10, 9), true);
		expect(this.grid._colCounts[10]).toEqual(1);

		this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(10, 10), true);
		expect(this.grid._colCounts[10]).toEqual(4);
		expect(this.grid._colCounts[11]).toEqual(3);
		expect(this.grid._colCounts[12]).toEqual(3);

		this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(10, 13), false);
		expect(this.grid._colCounts[10]).toEqual(6);
		expect(this.grid._colCounts[11]).toEqual(5);
		expect(this.grid._colCounts[12]).toEqual(3);

		this.grid.remove(new IgePoint2d(10, 10));
		expect(this.grid._colCounts[10]).toEqual(3);
		expect(this.grid._colCounts[11]).toEqual(2);
		expect(this.grid._colCounts[12]).not.toBeDefined();

		this.grid.remove(new IgePoint2d(10, 9));
		expect(this.grid._colCounts[10]).toEqual(2);
		expect(this.grid._colCounts[11]).toEqual(2);
		expect(this.grid._colCounts[12]).not.toBeDefined();

		this.grid.remove(new IgePoint2d(10, 13));
		expect(this.grid._colCounts[10]).not.toBeDefined();
		expect(this.grid._colCounts[11]).not.toBeDefined();
		expect(this.grid._colCounts[12]).not.toBeDefined();
	});

	it("should delete columns when their column count reaches 0.", function() {
		this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(10, 9), true);
		expect(this.grid._colCounts[10]).toEqual(1);

		this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(10, 10), true);
		expect(this.grid._colCounts[10]).toEqual(4);
		expect(this.grid._colCounts[11]).toEqual(3);
		expect(this.grid._colCounts[12]).toEqual(3);

		this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(10, 13), false);
		expect(this.grid._colCounts[10]).toEqual(6);
		expect(this.grid._colCounts[11]).toEqual(5);
		expect(this.grid._colCounts[12]).toEqual(3);

		expect(this.grid._grid[12]).toBeDefined();

		this.grid.remove(new IgePoint2d(10, 10));
		expect(this.grid._colCounts[10]).toEqual(3);
		expect(this.grid._colCounts[11]).toEqual(2);
		expect(this.grid._colCounts[12]).not.toBeDefined();
		expect(this.grid._grid[12]).not.toBeDefined();

		this.grid.remove(new IgePoint2d(10, 9));
		expect(this.grid._colCounts[10]).toEqual(2);
		expect(this.grid._colCounts[11]).toEqual(2);
		expect(this.grid._colCounts[12]).not.toBeDefined();
		expect(this.grid._grid[12]).not.toBeDefined();

		expect(this.grid._grid[10]).toBeDefined();
		expect(this.grid._grid[11]).toBeDefined();

		this.grid.remove(new IgePoint2d(10, 13));
		expect(this.grid._colCounts[10]).not.toBeDefined();
		expect(this.grid._colCounts[11]).not.toBeDefined();
		expect(this.grid._colCounts[12]).not.toBeDefined();

		expect(this.grid._grid[10]).not.toBeDefined();
		expect(this.grid._grid[11]).not.toBeDefined();
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
			}
			expect(this.grid.count()).toEqual(1);
		}
	);

	it("should erase references to removed objects.", function() {
		this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), true);
		this.grid.remove(new IgePoint2d(0, 0));
		expect(this.grid._grid[0]).not.toBeDefined();
	});

	it("should clear all locations that an object occupied when that object is removed.",
		function() {
			expect(this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(10, 10), true))
				.toEqual([]);

			expect(this.grid.remove(new IgePoint2d(10, 10))).toEqual([this.testObjects["3x3"][0]]);

			for (var x = 10; x < 13; x++) {
				for (var y = 10; y < 13; y++) {
					if (this.grid._grid[x]) {
						expect(this.grid._grid[x][y]).not.toBeDefined();
					}
				}
			}

			expect(this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(10, 10), true))
				.toEqual([]);

			expect(this.grid.remove(new IgePoint2d(10, 10), 2, 2)).toEqual([this.testObjects["3x3"][0]]);

			for (var x = 10; x < 13; x++) {
				for (var y = 10; y < 13; y++) {
					if (this.grid._grid[x]) {
						expect(this.grid._grid[x][y]).not.toBeDefined();
					}
				}
			}
		}
	);

	it("should clear all locations that displaced objects occupied when a new object is " +
			"added.",
		function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 100), false);
			expect(this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(100, 100), true))
				.toEqual([this.testObjects["2x2"][0]]);

			for (var x = 100; x < 102; x++) {
				for (var y = 100; y < 102; y++) {
					if (x === 100 && y === 100) {
						continue;
					}
					if (this.grid._grid[x]) {
						expect(this.grid._grid[x][y]).not.toBeDefined();
					}
				}
			}
		}
	)

	it("should always have a width of 0 if there are no objects inside of it.", function() {
		expect(this.grid.gridWidth()).toBe(0);
	});

	it("should always have a height of 0 if there are no objects inside of it.", function() {
		expect(this.grid.gridHeight()).toBe(0);
	});

	it("should be serializable to JSON and deserialized back to an equivalent object.",
		function() {
			for (var i = 0; i < 1500; i++) {
				var size = 1;
				var x = i;
				if (i < 500) {

				}
				else if (i < 1000) {
					size = 2;
					x = x * 2;
				}
				else {
					size = 3;
					x = x * 3;
				}
				this.grid.put(new TestGridObject(size, size), new IgePoint2d(x, 0), false);
			}

			var json = this.grid.toJSON();

			var deserialized = SparseGrid.fromJSON(TestGridObject, json);

			for (var i = 0; i < 1000; i++) {
				var x = i;
				if (i < 500) {

				}
				else if (i < 1000) {
					x = x * 2;
				}
				else {
					x = x * 3;
				}

				var originalObject = this.grid.get(new IgePoint2d(x, 0))[0];
				var clonedObject = deserialized.get(new IgePoint2d(x, 0))[0];
				expect(clonedObject.value).toEqual(originalObject.value);
				expect(clonedObject.gridData.width).toEqual(originalObject.gridData.width);
				expect(clonedObject.gridData.height).toEqual(originalObject.gridData.height);
			}
		}
	);

	describe("should update internal bounds and dimensions", function() {
		it("when an object is added.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.gridWidth()).toBe(2);
			expect(this.grid.gridHeight()).toBe(2);
		});

		it("when multiple objects are added.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.gridWidth()).toBe(2);
			expect(this.grid.gridHeight()).toBe(2);

			this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(-100, -22), true);
			expect(this.grid._lowerBound.x).toBe(-100);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.gridWidth()).toBe(202);
			expect(this.grid.gridHeight()).toBe(74)

			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(-200, 300), true);
			expect(this.grid._lowerBound.x).toBe(-200);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(300);

			expect(this.grid.gridWidth()).toBe(302);
			expect(this.grid.gridHeight()).toBe(323);
		});

		it("when an object is removed.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.gridWidth()).toBe(2);
			expect(this.grid.gridHeight()).toBe(2);

			this.grid.remove(new IgePoint2d(100, 50));
			expect(this.grid.count()).toBe(0);
			expect(this.grid.gridWidth()).toBe(0);
			expect(this.grid.gridHeight()).toBe(0);
		});

		it("when multiple objects are removed.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.gridWidth()).toBe(2);
			expect(this.grid.gridHeight()).toBe(2);

			this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(-100, -22), true);
			expect(this.grid._lowerBound.x).toBe(-100);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.gridWidth()).toBe(202);
			expect(this.grid.gridHeight()).toBe(74)

			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(-200, 300), true);
			expect(this.grid._lowerBound.x).toBe(-200);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(300);

			expect(this.grid.gridWidth()).toBe(302);
			expect(this.grid.gridHeight()).toBe(323);

			this.grid.remove(new IgePoint2d(-100, -22));
			expect(this.grid._lowerBound.x).toBe(-200);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(300);

			expect(this.grid.gridWidth()).toBe(302);
			expect(this.grid.gridHeight()).toBe(251);

			this.grid.remove(new IgePoint2d(-200, 300));
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.gridWidth()).toBe(2);
			expect(this.grid.gridHeight()).toBe(2);

			this.grid.remove(new IgePoint2d(100, 50));

			expect(this.grid.gridWidth()).toBe(0);
			expect(this.grid.gridHeight()).toBe(0);
		});
	});
});