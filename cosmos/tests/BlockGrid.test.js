var GridClass = BlockGridNew;

xdescribe("A BlockGrid", function() {
	testGrid(
		// beforeEachFunc
		function() {
			this.grid = new GridClass();
			ige.isServer = true;
			this.testObject = new IronBlock();
		},
		// afterEachFunc
		function() {
			this.testObject.destroy();
			ige.isServer = false;
			this.grid.destroy();
		}
	);
});