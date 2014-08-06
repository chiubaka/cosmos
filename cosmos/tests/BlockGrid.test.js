var GridClass = BlockGridNew;

describe("A BlockGrid", function() {
	var grid;
	var ironBlock;
	beforeEach(function() {
		grid = new GridClass({blockTypeMatrix: []});
		// Pretend to be the server so that blocks don't trigger rendering code.
		ige.isServer = true;
		ironBlock = new IronBlock();
	});

	afterEach(function() {
		ironBlock.destroy();
		// Go back to pretending to be the client so that creating a new BlockGrid doesn't complain about not having
		// attached the Box2D Physics component to IGE.
		ige.isServer = false;
		grid.destroy();
	});

	it("should be able to retrieve a block that has been added to it.", function() {
		grid.add(ironBlock, new GridLocation(0, 0));
		expect(grid.get(new GridLocation(0, 0))).toBe(ironBlock);
		expect(true).toBe(false);
	});

	it("should not be able to retrieve a block that has been removed from it.", function() {
		grid.add(ironBlock, new GridLocation(0, 0));
		expect(grid.get(new GridLocation(0, 0)).toBe(ironBlock));
		grid.remove(new GridLocation(0, 0));
		expect(grid.get(new GridLocation(0, 0))).toBe(undefined);
	});

	it("should be able to handle negative values.", function() {
		grid.add(ironBlock, new GridLocation(-1, -1));
		expect(grid.get(new GridLocation(-1, -1))).toBe(ironBlock);
	});

	it("should return undefined if asked to retrieve a block at a location that is unoccupied.", function() {
		expect(grid.get(10, 10)).toBe(undefined);
	});

	it("should fail gracefully if no block is passed to the add function.", function() {
		grid.add(undefined, new GridLocation(0, 0));
	});

	it("should fail gracefully if no location is passed to the add function.", function() {
		grid.add(ironBlock, undefined);
	});

	it("should fail gracefully if no location is passed to the get function.", function() {
		grid.get(undefined);
	});

	it("should fail gracefully if no location is passed to the remove function.", function() {
		grid.remove(undefined);
	});

	it("should be able to handle hundreds of blocks.", function() {
		pending();
	});
});