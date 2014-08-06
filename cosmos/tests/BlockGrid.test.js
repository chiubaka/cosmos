var GridClass = BlockGridNew;

describe("A BlockGrid", function() {
	testGrid(
		function() {
			this.grid = new GridClass();
			ige.isServer = true;
			this.testObject = new IronBlock();
		},
		function() {
			this.testObject.destroy();
			ige.isServer = false;
			this.grid.destroy();
		}
	);
});