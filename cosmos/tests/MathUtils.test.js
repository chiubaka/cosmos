describe("MathUtils", function() {

	describe("worldVectorToLocalVector", function() {
		beforeEach(function() {
			this.exampleEntity = new IgeEntity();
			this.examplePoint = new IgePoint2d(10, 20);
		});

		it("should be the inverse of localVectorToWorldVector.", function() {
			expect(MathUtils.localVectorToWorldVector(
				MathUtils.worldVectorToLocalVector(this.examplePoint, this.exampleEntity)))
				.toEqual(this.examplePoint);
		});
	});
});