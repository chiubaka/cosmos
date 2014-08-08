var GridClass = BlockGridNew;

describe("A BlockGrid", function() {
	function beforeEachFunc() {
		this.grid = new GridClass();
		ige.isServer = true;
		this.testObjects = {};
		this.testObjects["1x1"] = [
			new IronBlock(),
			new CarbonBlock(),
			new IceBlock(),
			new GoldBlock()
		];

		// TODO: This is a hack. When we actually have blocks that are 2x2 and 3x3, I won't need
		// this.
		var iron2x2 = new IronBlock();
		iron2x2.gridData.width = iron2x2.gridData.height = 2;

		var carbon2x2 = new CarbonBlock();
		carbon2x2.gridData.width = carbon2x2.gridData.height = 2;

		var ice2x2 = new IceBlock();
		ice2x2.gridData.width = ice2x2.gridData.height = 2;

		var gold2x2 = new GoldBlock();
		gold2x2.gridData.width = gold2x2.gridData.height = 2;

		this.testObjects["2x2"] = [
			iron2x2,
			carbon2x2,
			ice2x2,
			gold2x2
		];

		var iron3x3 = new IronBlock();
		iron3x3.gridData.width = iron3x3.gridData.height = 3;

		var carbon3x3 = new CarbonBlock();
		carbon3x3.gridData.width = carbon3x3.gridData.height = 3;

		var ice3x3 = new IceBlock();
		ice3x3.gridData.width = ice3x3.gridData.height = 3;

		var gold3x3 = new GoldBlock();
		gold3x3.gridData.width = gold3x3.gridData.height = 3;

		this.testObjects["3x3"] = [
			iron3x3,
			carbon3x3,
			ice3x3,
			gold3x3
		];
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

	testGrid(GridClass, function() {});//beforeEachFunc, afterEachFunc);

	it("should always return grid coordinates (0, 0) if there are no blocks already in the " +
			"grid.",
		function() {
			this.testObjects["1x1"][0].gridData.loc = new IgePoint2d(10, 10);
			expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][0]))
				.toEqual(jasmine.objectContaining({x: 0, y: 0}));

			this.testObjects["1x1"][0].gridData.loc = new IgePoint2d(0, 0);
			expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][0]))
				.toEqual(jasmine.objectContaining({x: 0, y: 0}));

			this.testObjects["1x1"][0].gridData.loc = new IgePoint2d(-10, -10);
			expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][0]))
				.toEqual(jasmine.objectContaining({x: 0, y: 0}));
		}
	);

	it("should correctly determine the grid coordinates for a given grid location.", function() {
		// With one block in the grid.
		this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false);

		this.testObjects["1x1"][1].gridData.loc = new IgePoint2d(1, 1);
		expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][1]))
			.toEqual(jasmine.objectContaining({x: 26, y: 26}));

		this.testObjects["1x1"][2].gridData.loc = new IgePoint2d(-4, -4);
		expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][2]))
			.toEqual(jasmine.objectContaining({x: -104, y: -104}));

		this.testObjects["1x1"][3].gridData.loc = new IgePoint2d(-5, 2);
		expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][3]))
			.toEqual(jasmine.objectContaining({x: -130, y: 52}));

		// With two blocks in the grid.
		this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(0, 1), false);

		this.testObjects["1x1"][2].gridData.loc = new IgePoint2d(-4, -4);
		expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][2]))
			.toEqual(jasmine.objectContaining({x: -104, y: -117}));

		this.testObjects["1x1"][3].gridData.loc = new IgePoint2d(-5, 2);
		expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][3]))
			.toEqual(jasmine.objectContaining({x: -130, y: 39}));

		// With a larger block in the grid.
		this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(1, 1), false);

		this.testObjects["1x1"][2].gridData.loc = new IgePoint2d(-4, -4);
		expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][2]))
			.toEqual(jasmine.objectContaining({x: -104, y: -104}));

		this.testObjects["1x1"][3].gridData.loc = new IgePoint2d(-5, 2);
		expect(this.grid._gridCoordinatesForBlock(this.testObjects["1x1"][3]))
			.toEqual(jasmine.objectContaining({x: -130, y: 52}));
	});
});