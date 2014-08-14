describe("BlockStructure", function() {


	describe("constructionFilterForBlock", function() {
		function testConstructionFilterForBlock(width, height, expectedFilter) {
			var testBlock = TestUtils.testBlock(width, height);

			var filter = BlockStructure.constructionFilterForBlock(testBlock);
			expect(filter).toEqual(expectedFilter);
		}

		it("should return the correct filter matrix for 1x1 blocks.", function() {
			testConstructionFilterForBlock(1, 1, [
				[0, 1, 0],
				[1, -5, 1],
				[0, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 2x2 blocks.", function() {
			testConstructionFilterForBlock(2, 2, [
				[0, 1, 1, 0],
				[1, -9, -9, 1],
				[1, -9, -9, 1],
				[0, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 2x3 blocks.", function() {
			testConstructionFilterForBlock(2, 3, [
				[0, 1, 1, 1, 0],
				[1, -11, -11, -11, 1],
				[1, -11, -11, -11, 1],
				[0, 1, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 3x2 blocks.", function() {
			testConstructionFilterForBlock(3, 2, [
				[0, 1, 1, 0],
				[1, -11, -11, 1],
				[1, -11, -11, 1],
				[1, -11, -11, 1],
				[0, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 3x3 blocks.", function() {
			testConstructionFilterForBlock(3, 3, [
				[0, 1, 1, 1, 0],
				[1, -13, -13, -13, 1],
				[1, -13, -13, -13, 1],
				[1, -13, -13, -13, 1],
				[0, 1, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 9x9 blocks.", function() {
			testConstructionFilterForBlock(9, 9, [
				[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[1, -37, -37, -37, -37, -37, -37, -37, -37, -37, 1],
				[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
			]);
		});
	});
});