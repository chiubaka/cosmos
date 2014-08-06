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
					expect(this.grid._gridCoordinatesForLocation(new GridLocation(10, 10)))
						.toEqual(jasmine.objectContaining({x: 0, y: 0}));
					expect(this.grid._gridCoordinatesForLocation(new GridLocation(0, 0)))
						.toEqual(jasmine.objectContaining({x: 0, y: 0}));
					expect(this.grid._gridCoordinatesForLocation(new GridLocation(-10, -10)))
						.toEqual(jasmine.objectContaining({x: 0, y: 0}));
				}
			);
		}
	);

	// TODO: Create tests in this category.
	xdescribe("should be able to handle blocks of different sizes:", function() {

	});
});