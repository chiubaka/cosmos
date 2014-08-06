describe("A SparseGrid", function() {
	testGrid(
		// beforeEachFunc
		function() {
			this.grid = new SparseGrid();
			this.testObjects = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		},
		// afterEachFunc
		function() {}
	);
});