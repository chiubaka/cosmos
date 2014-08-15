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

	describe("constructionLocations", function() {
		function testConstructionLocationsWithSingleBlock(blockWidth, blockHeight, gridWidth,
														  gridHeight, loc, expectedResult)
		{
			var structure = new BlockStructure();
			structure.put(TestUtils.testBlock(gridWidth, gridHeight), loc, true);

			var result = structure.constructionLocations(TestUtils.testBlock(blockWidth,
				blockHeight));

			expect(result).toEqual(expectedResult);
		}

		it("should return the correct locations for constructing a 1x1 on a 1x1 grid at (0, 0).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 1, 1, new IgePoint2d(0, 0), [
					[0, 1, 0],
					[1, -5, 1],
					[0, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 1x1 grid at (1, 2).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 1, 1, new IgePoint2d(1, 2), [
					[0, 1, 0],
					[1, -5, 1],
					[0, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 1x1 grid at (-2, -5).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 1, 1, new IgePoint2d(-2, -5), [
					[0, 1, 0],
					[1, -5, 1],
					[0, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x2 grid at (0, 0).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 2, 2, new IgePoint2d(0, 0), [
					[0, 1, 1, 0],
					[1, -3, -3, 1],
					[1, -3, -3, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x2 grid at (3, -10).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 2, 2, new IgePoint2d(3, -10), [
					[0, 1, 1, 0],
					[1, -3, -3, 1],
					[1, -3, -3, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x2 grid at (-4, 20).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 2, 2, new IgePoint2d(-4, 20), [
					[0, 1, 1, 0],
					[1, -3, -3, 1],
					[1, -3, -3, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x3 grid at (1, 2).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 2, 3, new IgePoint2d(1, 2), [
					[0, 1, 1, 1, 0],
					[1, -3, -2, -3, 1],
					[1, -3, -2, -3, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x2 grid at (-2, -5).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 3, 2, new IgePoint2d(-2, -5), [
					[0, 1, 1, 0],
					[1, -3, -3, 1],
					[1, -2, -2, 1],
					[1, -3, -3, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x3 grid at (0, 0).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 3, 3, new IgePoint2d(0, 0), [
					[0, 1, 1, 1, 0],
					[1, -3, -2, -3, 1],
					[1, -2, -1, -2, 1],
					[1, -3, -2, -3, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x3 grid at (3, -10).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 3, 3, new IgePoint2d(3, -10), [
					[0, 1, 1, 1, 0],
					[1, -3, -2, -3, 1],
					[1, -2, -1, -2, 1],
					[1, -3, -2, -3, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x3 grid at (-4, 20).",
			function() {
				testConstructionLocationsWithSingleBlock(1, 1, 3, 3, new IgePoint2d(-4, 20), [
					[0, 1, 1, 1, 0],
					[1, -3, -2, -3, 1],
					[1, -2, -1, -2, 1],
					[1, -3, -2, -3, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 2x2 on a 1x1 grid at (-2, -5).",
			function() {
				testConstructionLocationsWithSingleBlock(2, 2, 1, 1, new IgePoint2d(-2, -5), [
					[0, 1, 1, 0, 0],
					[1, -9, -9, 1, 0],
					[1, -9, -9, 1, 0],
					[0, 1, 1, 0, 0],
					[0, 0, 0, 0, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 3x3 on a 1x1 grid at (-2, -5).",
			function() {
				testConstructionLocationsWithSingleBlock(3, 3, 1, 1, new IgePoint2d(-2, -5), [
					[0, 1, 1, 1, 0, 0, 0],
					[1, -13, -13, -13,  1, 0, 0],
					[1, -13, -13, -13,  1, 0, 0],
					[1, -13, -13, -13,  1, 0, 0],
					[0, 1, 1, 1, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0]
				]);
			}
		);
	});
});