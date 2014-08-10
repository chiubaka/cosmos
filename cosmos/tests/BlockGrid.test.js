var GridClass = BlockGrid;

describe("A BlockGrid", function() {
	function beforeEachFunc() {
		this.grid = new GridClass();
		//ige.isServer = true;
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
		//ige.isServer = false;
		this.grid.destroy();
	}

	beforeEach(beforeEachFunc);
	afterEach(afterEachFunc);

	testGrid(GridClass, function() {});//beforeEachFunc, afterEachFunc);

	it("should have the correct width and height after blocks are placed in it.", function() {
		expect(this.grid.width()).toBe(0);
		expect(this.grid.height()).toBe(0);

		this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false);
		expect(this.grid.width()).toBe(Block.WIDTH);
		expect(this.grid.height()).toBe(Block.HEIGHT);

		this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(2, 2), false);
		expect(this.grid.width()).toBe(Block.WIDTH * 4);
		expect(this.grid.height()).toBe(Block.HEIGHT * 4);

		this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(-5, -5), false);
		expect(this.grid.width()).toBe(Block.WIDTH * 9);
		expect(this.grid.height()).toBe(Block.HEIGHT * 9);
	});

	it("should mount blocks to its render container on the client.", function() {
		expect(this.grid._renderContainer).toBeDefined();

		this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(0, 0), false);
		expect(this.testObjects["1x1"][0]._parent).toBe(this.grid._renderContainer);
	});

	it("should correctly compute render coordinates for locations.", function() {
		expect(BlockGrid.coordinatesForLocation(new IgePoint2d(0, 0)))
			.toEqual(jasmine.objectContaining({x: 0, y: 0}));

		expect(BlockGrid.coordinatesForLocation(new IgePoint2d(100, 99)))
			.toEqual(jasmine.objectContaining({x: 2600, y: 2574}));

		expect(BlockGrid.coordinatesForLocation(new IgePoint2d(-13, -20)))
			.toEqual(jasmine.objectContaining({x: -338, y: -520}));
	});

	it("should translate the render container based on blocks that are added to the grid.",
		function() {
			this.grid.put(this.testObjects["1x1"][0], new IgePoint2d(1, 1), false);
			expect(this.grid._renderContainer.translate().x()).toBe(-Block.WIDTH);
			expect(this.grid._renderContainer.translate().y()).toBe(-Block.HEIGHT);

			this.grid.put(this.testObjects["1x1"][1], new IgePoint2d(0, 0), false);
			expect(this.grid._renderContainer.translate().x()).toBe(-Block.WIDTH / 2);
			expect(this.grid._renderContainer.translate().y()).toBe(-Block.HEIGHT / 2);

			this.grid.put(this.testObjects["2x2"][0], new IgePoint2d(-3, -3), false);
			expect(this.grid._renderContainer.translate().x()).toBe(Block.WIDTH);
			expect(this.grid._renderContainer.translate().y()).toBe(Block.HEIGHT);

			this.grid.put(this.testObjects["3x3"][0], new IgePoint2d(-1, -6), false);
			expect(this.grid._renderContainer.translate().x()).toBe(Block.WIDTH);
			expect(this.grid._renderContainer.translate().y()).toBe(Block.HEIGHT * 2.5);
		}
	);
});