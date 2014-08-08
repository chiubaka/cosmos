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
	);
});