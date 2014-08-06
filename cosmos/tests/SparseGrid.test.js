describe("A SparseGrid", function() {
	testGrid(
		// beforeEachFunc
		function() {
			this.grid = new SparseGrid();
			this.testObject = 4;
		},
		// afterEachFunc
		function() {}
	);
});