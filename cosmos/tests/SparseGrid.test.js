var TestGridObject = IgeEntity.extend({
	classId: 'TestGridObject',

	init: function(width, height) {
		IgeEntity.prototype.init.call(this);
		this.addComponent(GridData, {width: width, height: height});
	}
});

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

	testGrid();

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
		expect(this.grid.width()).toBe(0);
	});

	it("should always have a height of 0 if there are no objects inside of it.", function() {
		expect(this.grid.height()).toBe(0);
	});

	describe("should update internal bounds and dimensions", function() {
		it("when an object is added.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.width()).toBe(2);
			expect(this.grid.height()).toBe(2);
		});

		it("when multiple objects are added.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.width()).toBe(2);
			expect(this.grid.height()).toBe(2);

			this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(-100, -22), true);
			expect(this.grid._lowerBound.x).toBe(-100);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.width()).toBe(202);
			expect(this.grid.height()).toBe(74)

			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(-200, 300), true);
			expect(this.grid._lowerBound.x).toBe(-200);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(300);

			expect(this.grid.width()).toBe(302);
			expect(this.grid.height()).toBe(323);
		});

		it("when an object is removed.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.width()).toBe(2);
			expect(this.grid.height()).toBe(2);

			this.grid.remove(new IgePoint2d(100, 50));
			expect(this.grid.count()).toBe(0);
			expect(this.grid.width()).toBe(0);
			expect(this.grid.height()).toBe(0);
		});

		it("when multiple objects are removed.", function() {
			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(100, 50), true);
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.width()).toBe(2);
			expect(this.grid.height()).toBe(2);

			this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(-100, -22), true);
			expect(this.grid._lowerBound.x).toBe(-100);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.width()).toBe(202);
			expect(this.grid.height()).toBe(74)

			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(-200, 300), true);
			expect(this.grid._lowerBound.x).toBe(-200);
			expect(this.grid._lowerBound.y).toBe(-22);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(300);

			expect(this.grid.width()).toBe(302);
			expect(this.grid.height()).toBe(323);

			this.grid.remove(new IgePoint2d(-100, -22));
			expect(this.grid._lowerBound.x).toBe(-200);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(300);

			expect(this.grid.width()).toBe(302);
			expect(this.grid.height()).toBe(251);

			this.grid.remove(new IgePoint2d(-200, 300));
			expect(this.grid._lowerBound.x).toBe(100);
			expect(this.grid._lowerBound.y).toBe(50);
			expect(this.grid._upperBound.x).toBe(101);
			expect(this.grid._upperBound.y).toBe(51);

			expect(this.grid.width()).toBe(2);
			expect(this.grid.height()).toBe(2);

			this.grid.remove(new IgePoint2d(100, 50));

			expect(this.grid.width()).toBe(0);
			expect(this.grid.height()).toBe(0);
		});
	});
});