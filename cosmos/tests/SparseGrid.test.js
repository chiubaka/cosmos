var TestGridObject = IgeClass.extend({
	classId: 'TestGridObject',

	init: function(width, height) {
		this.addComponent(GridData, width, height);
	}
});

describe("A SparseGrid", function() {
	testGrid(
		// beforeEachFunc
		function() {
			this.grid = new SparseGrid();
			this.testObjects["1x1"] = [
				new TestGridObject(1, 1),
				new TestGridObject(1, 1),
				new TestGridObject(1, 1),
				new TestGridObject(1, 1)
			];
			this.testObjects["2x2"] = [
				new TestGridObject(2, 2),
				new TestGridObject(2, 2),
				new TestGridObject(2, 2),
				new TestGridObject(2, 2)
			];
			this.testObjects["3x3"] = [
				new TestGridObject(3, 3),
				new TestGridObject(3, 3),
				new TestGridObject(3, 3),
				new TestGridObject(3, 3)
			];
		},
		// afterEachFunc
		function() {}
	);
});