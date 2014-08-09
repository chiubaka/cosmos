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


});