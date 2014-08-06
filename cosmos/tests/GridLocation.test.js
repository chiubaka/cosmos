describe("A GridLocation", function() {
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
});