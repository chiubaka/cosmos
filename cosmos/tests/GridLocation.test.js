describe("A GridLocation", function() {
	describe("should have public interface functions that fails gracefully", function() {
		beforeEach(function() {
			TestUtils.disableLogging();
		});

		afterEach(function() {
			TestUtils.enableLogging();
		});

		it("when no location is passed to the copy function.", function() {
			var copy = GridLocation.copy();
			expect(copy).not.toBeDefined();
		});

		it("when one or both of the locations is not passed to the subtract function.", function() {
			var location1 = new GridLocation(-9001, -9001);
			var location2 = new GridLocation(1234, 1234);

			var result = GridLocation.subtract();
			expect(result).not.toBeDefined();

			result = GridLocation.subtract(location1);
			expect(result).not.toBeDefined();

			result = GridLocation.subtract(undefined, location2);
			expect(result).not.toBeDefined();
		});
	});

	it("is not valid if it is undefined.", function() {
		expect(GridLocation.validateLocation()).toBe(false);
	});

	it("is not valid if its row is not defined.", function() {
		expect(GridLocation.validateLocation(new GridLocation(undefined, 0))).toBe(false);
	});

	it("is not valid if its col is not defined.", function() {
		expect(GridLocation.validateLocation(new GridLocation(0, undefined))).toBe(false);
	});

	it("is valid if the location is defined and it has both a row and col.", function() {
		expect(GridLocation.validateLocation(new GridLocation(10, 10))).toBe(true);
	});

	it("can handle negative numbers.", function() {
		expect(GridLocation.validateLocation(new GridLocation(-1, -5))).toBe(true);
	});

	it("can be subtracted from another GridLocation.", function() {
		var location1 = new GridLocation(20, 15);
		var location2 = new GridLocation(5, 10);
		expect(GridLocation.subtract(location1, location2)).toEqual(new GridLocation(15, 5));
		expect(GridLocation.subtract(location2, location1)).toEqual(new GridLocation(-15, -5));
	});

	it("can be copied.", function() {
		var location = new GridLocation(4, 5);
		var copy = GridLocation.copy(location);
		expect(location).not.toBe(copy);
		expect(location).toEqual(copy);
	});
});