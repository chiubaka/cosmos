/**
 * Tests an object that has the Grid interface.
 * @param beforeEachFunc {function} The function to run before each Grid interface test. This function must, at minimum,
 * create an object and assign it to this.grid and assign an object to this.testObject.
 * @param afterEachFunc {function} The function to run after each Grid interface test.
 */
var testGrid = function(beforeEachFunc, afterEachFunc) {
	describe("implementing the Grid interface", function() {
		beforeEach(beforeEachFunc);
		afterEach(afterEachFunc);

		it("should fail gracefully if no object is passed to the add function.", function() {
			this.grid.add(undefined, new GridLocation(0, 0));
		});

		it("should fail gracefully if no location is passed to the add function.", function() {
			this.grid.add(this.testObject, undefined);
		});

		it("should fail gracefully if no location is passed to the get function.", function() {
			this.grid.get(undefined);
		});

		it("should fail gracefully if no location is passed to the remove function.", function() {
			this.grid.remove(undefined);
		});

		it("should be able to handle negative values.", function() {
			this.grid.add(this.testObject, new GridLocation(-1, -1));
			expect(this.grid.get(new GridLocation(-1, -1))).toBe(this.testObject);
		});

		it("should return undefined if asked to retrieve an object at a location that is unoccupied.", function() {
			expect(this.grid.get(new GridLocation(10, 10))).not.toBeDefined();
		});

		it("should be able to retrieve an object that has been added to it.", function() {
			this.grid.add(this.testObject, new GridLocation(0, 0));
			expect(this.grid.get(new GridLocation(0, 0))).toBe(this.testObject);
		});

		it("should not be able to retrieve an object that has been removed from it.", function() {
			this.grid.add(this.testObject, new GridLocation(0, 0));
			expect(this.grid.get(new GridLocation(0, 0)).toBe(this.testObject));
			this.grid.remove(new GridLocation(0, 0));
			expect(this.grid.get(new GridLocation(0, 0))).not.toBeDefined();
		});

		it("should be able to handle hundreds of objects.");
	});
};