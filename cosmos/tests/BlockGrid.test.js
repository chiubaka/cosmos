var GridClass = BlockGridNew;

describe("A BlockGrid", function() {
	function beforeEachFunc() {
		this.grid = new GridClass();
		ige.isServer = true;
		this.testObjects = [new IronBlock(), new CarbonBlock(), new IceBlock()];
	}

	function afterEachFunc() {
		for (var i = 0; i < this.testObjects.length; i++) {
			this.testObjects[i].destroy();
		}
		ige.isServer = false;
		this.grid.destroy();
	}

	beforeEach(beforeEachFunc);
	afterEach(afterEachFunc);

	testGrid(function() {}, function() {});//beforeEachFunc, afterEachFunc);

	describe("should correctly determine the grid coordinates for a given grid location:",
		function() {
			it("should always return (0, 0) if there are no blocks already in the grid",
				function() {
					this.testObjects[0].location(new GridLocation(10, 10));
					expect(this.grid._gridCoordinatesForBlock(this.testObjects[0]))
						.toEqual(jasmine.objectContaining({x: 0, y: 0}));
					this.testObjects[0].location(new GridLocation(0, 0));
					expect(this.grid._gridCoordinatesForBlock(this.testObjects[0]))
						.toEqual(jasmine.objectContaining({x: 0, y: 0}));
					this.testObjects[0].location(new GridLocation(-10, -10));
					expect(this.grid._gridCoordinatesForBlock(this.testObjects[0]))
						.toEqual(jasmine.objectContaining({x: 0, y: 0}));
				}
			);
		}
	);

	describe("should correctly update its location bounds", function() {
		function placeBlocksAndCheckLocationBounds() {
			this.grid.put(this.testObjects[0], new GridLocation(5, 0));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(5, 0));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(5, 0));

			this.grid.put(this.testObjects[0], new GridLocation(10, 0));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(5, 0));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(10, 0));

			this.grid.put(this.testObjects[0], new GridLocation(0, 9));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(0, 0));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(10, 9));

			this.grid.put(this.testObjects[0], new GridLocation(-9, 0));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(-9, 0));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(10, 9));

			this.grid.put(this.testObjects[0], new GridLocation(0, -10));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(-9, -10));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(10, 9));
		}

		it("when blocks are placed", function() {
			placeBlocksAndCheckLocationBounds.call(this);
		});

		it("when blocks are removed", function() {
			placeBlocksAndCheckLocationBounds.call(this);

			this.grid.remove(new GridLocation(5, 0));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(-9, -10));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(10, 9));

			this.grid.remove(new GridLocation(10, 0));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(-9, -10));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(0, 9));

			this.grid.remove(new GridLocation(0 , -10));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(-9, 0));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(0, 9));

			this.grid.remove(new GridLocation(0 , 9));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(-9, 0));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(0, 0));

			this.grid.remove(new GridLocation(-9 , 0));
			expect(this.grid._lowerLocBound).toEqual(new GridLocation(0, 0));
			expect(this.grid._upperLocBound).toEqual(new GridLocation(0, 0));
		});
	});

	// TODO: Create tests in this category.
	xdescribe("should be able to handle blocks of different sizes:", function() {

	});
});