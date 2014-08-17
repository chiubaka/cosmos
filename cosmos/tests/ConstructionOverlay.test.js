describe("ConstructionOverlay", function() {
	describe("constructionFilter", function() {
		function testConstructionFilter(width, height, expectedFilter) {
			var filter = ConstructionOverlay.constructionFilter(width, height);
			expect(filter).toEqual(expectedFilter);
		}

		it("should return the correct filter matrix for 1x1 blocks.", function() {
			testConstructionFilter(1, 1, [
				[0, 1, 0],
				[1, -5, 1],
				[0, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 2x2 blocks.", function() {
			testConstructionFilter(2, 2, [
				[0, 1, 1, 0],
				[1, -9, -9, 1],
				[1, -9, -9, 1],
				[0, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 2x3 blocks.", function() {
			testConstructionFilter(2, 3, [
				[0, 1, 1, 1, 0],
				[1, -11, -11, -11, 1],
				[1, -11, -11, -11, 1],
				[0, 1, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 3x2 blocks.", function() {
			testConstructionFilter(3, 2, [
				[0, 1, 1, 0],
				[1, -11, -11, 1],
				[1, -11, -11, 1],
				[1, -11, -11, 1],
				[0, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 3x3 blocks.", function() {
			testConstructionFilter(3, 3, [
				[0, 1, 1, 1, 0],
				[1, -13, -13, -13, 1],
				[1, -13, -13, -13, 1],
				[1, -13, -13, -13, 1],
				[0, 1, 1, 1, 0]
			]);
		});

		it("should return the correct filter matrix for 9x9 blocks.", function() {
			testConstructionFilter(9, 9, [
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

	describe("_computeConstructionLocations", function() {
		function testComputeConstructionLocationsWithSingleBlock(blockWidth, blockHeight, gridWidth,
														  gridHeight, loc, expectedResult)
		{
			ige.client.state = new ClientState();
			ige.client.state._selectedCap = "construct";
			var structure = new BlockStructure();
			structure.put(TestUtils.testBlock(gridWidth, gridHeight), loc, true);

			structure._constructionOverlay._computeConstructionLocations(blockWidth, blockHeight);

			var result = structure._constructionOverlay._constructionLocations;

			expect(result).toEqual(expectedResult);
		}

		it("should return the correct locations for constructing a 1x1 on a 1x1 grid at (0, 0).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 1, 1, new IgePoint2d(0, 0), [
					[0, 1, 0],
					[1, 0, 1],
					[0, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 1x1 grid at (1, 2).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 1, 1, new IgePoint2d(1, 2), [
					[0, 1, 0],
					[1, 0, 1],
					[0, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 1x1 grid at (-2, -5).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 1, 1, new IgePoint2d(-2, -5), [
					[0, 1, 0],
					[1, 0, 1],
					[0, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x2 grid at (0, 0).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 2, 2, new IgePoint2d(0, 0), [
					[0, 1, 1, 0],
					[1, 0, 0, 1],
					[1, 0, 0, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x2 grid at (3, -10).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 2, 2, new IgePoint2d(3, -10), [
					[0, 1, 1, 0],
					[1, 0, 0, 1],
					[1, 0, 0, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x2 grid at (-4, 20).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 2, 2, new IgePoint2d(-4, 20), [
					[0, 1, 1, 0],
					[1, 0, 0, 1],
					[1, 0, 0, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 2x3 grid at (1, 2).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 2, 3, new IgePoint2d(1, 2), [
					[0, 1, 1, 1, 0],
					[1, 0, 0, 0, 1],
					[1, 0, 0, 0, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x2 grid at (-2, -5).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 3, 2, new IgePoint2d(-2, -5), [
					[0, 1, 1, 0],
					[1, 0, 0, 1],
					[1, 0, 0, 1],
					[1, 0, 0, 1],
					[0, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x3 grid at (0, 0).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 3, 3, new IgePoint2d(0, 0), [
					[0, 1, 1, 1, 0],
					[1, 0, 0, 0, 1],
					[1, 0, 0, 0, 1],
					[1, 0, 0, 0, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x3 grid at (3, -10).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 3, 3, new IgePoint2d(3, -10), [
					[0, 1, 1, 1, 0],
					[1, 0, 0, 0, 1],
					[1, 0, 0, 0, 1],
					[1, 0, 0, 0, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 1x1 on a 3x3 grid at (-4, 20).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(1, 1, 3, 3, new IgePoint2d(-4, 20), [
					[0, 1, 1, 1, 0],
					[1, 0, 0, 0, 1],
					[1, 0, 0, 0, 1],
					[1, 0, 0, 0, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 2x2 on a 1x1 grid at (-2, -5).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(2, 2, 1, 1, new IgePoint2d(-2, -5), [
					[0, 1, 1, 1, 0],
					[1, 1, 1, 1, 1],
					[1, 1, 0, 1, 1],
					[1, 1, 1, 1, 1],
					[0, 1, 1, 1, 0]
				]);
			}
		);

		it("should return the correct locations for constructing a 3x3 on a 1x1 grid at (-2, -5).",
			function() {
				testComputeConstructionLocationsWithSingleBlock(3, 3, 1, 1, new IgePoint2d(-2, -5), [
					[0, 1, 1, 1, 1, 1, 0],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 0, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[1, 1, 1, 1, 1, 1, 1],
					[0, 1, 1, 1, 1, 1, 0]
				]);
			}
		);
	});
});