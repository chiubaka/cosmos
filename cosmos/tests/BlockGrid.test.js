var GridClass = BlockGridNew;

describe("A BlockGrid", function() {
	testGrid(
		// beforeEachFunc
		function() {
			this.grid = new GridClass();
			ige.isServer = true;
			this.testObjects = [new IronBlock(), new CarbonBlock(), new IceBlock()];
		},
		// afterEachFunc
		function() {
			for (var i = 0; i < this.testObjects.length; i++) {
				this.testObjects[i].destroy();
			}
			ige.isServer = false;
			this.grid.destroy();
		}
	);



	// TODO: Create tests in this category.
	xdescribe("should be able to handle blocks of different sizes:", function() {

	});
});