var BlockGrid = IgeEntityBox2d.extend({
	classId: "BlockGrid",

	_physicsContainer: undefined,
	_physicsOffset: undefined,
	_renderContainer: undefined,

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		this.implement(SparseGrid);
		SparseGrid.prototype.init.call(this, data);
		//this._grid = new SparseGrid();

		this.width(0);
		this.height(0);

		this.addComponent(PixiRenderableComponent);

		// #ifdef CLIENT
		if (ige.isClient) {
			// Create the render container and mount it to this entity.
			this._renderContainer = new RenderContainer();
			this._renderContainer.width(0);
			this._renderContainer.height(0);
			this._renderContainer.mount(this);

			if (data !== undefined) {
				this.fromJSON(Block, data);
			}
		}
		// #else
		else {
			this.box2dBody({
				type: 'dynamic',
				linearDamping: 0.4,
				angularDamping: 1.5,
				allowSleep: true,
				bullet: false,
				gravitic: false,
				fixedRotation: false
			});
		}
		// #endif
	},

	/**
	 * Resets this BlockGrid's internal state to represent the grid that is represented by the provided {@link Block}
	 * matrix, which is a matrix of {@link Block}s. undefined is used to indicate that a space in the matrix is empty.
	 * @param blockMatrix {Array} An array of arrays that holds {@link Block objects}. undefined is used to indicate
	 * that a space in the blockMatrix is empty. The blockMatrix must be a rectangular matrix (every row has the same
	 * number of columns and every column has the same number of rows, but the total number of rows and total number
	 * of columns is not required to be the same).
	 * @param checkForNeighbors {boolean} Whether or not we should validate that each {@link Block} will be
	 * attached to the existing structure in this {@link BlockGrid}. Default behavior is to check for neighbors.
	 * @return {BlockGrid} Return this object to make function chaining convenient.
	 * @memberof BlockGrid
	 * @instance
	 */
	fromBlockMatrix: function(blockMatrix, checkForNeighbors) {
		for (var row = 0; row < blockMatrix.length; row++) {
			for (var col = 0; col < blockMatrix[row].length; col++) {
				if (blockMatrix[row][col]) {
					this.put(blockMatrix[row][col], new IgePoint2d(col, row), false);
				}
			}
		}

		return this;
	},

	/**
	 * Resets this BlockGrid's internal state to represent the grid that is represented by the provided block type
	 * matrix, which is a matrix of class ID's where each class ID represents a block type in the grid.
	 * This is used for de-serializing a BlockGrid object.
	 * @param blockTypeMatrix {Array} An array of arrays that holds classId's for Block objects. undefined is used to
	 * indicate that a space in the blockTypeMatrix does not include a Block. The blockTypeMatrix must be a rectangular
	 * matrix (every row has the same number of columns and every column has the same number of rows, but the total number
	 * of rows and total number of columns is not required to be the same).
	 * @param checkForNeighbors {boolean} Whether or not we should validate that each {@link Block} will be
	 * attached to the existing structure in this {@link BlockGrid}. Default behavior is to check for neighbors.
	 * @returns {BlockGrid} Return this object to make function chaining convenient.
	 * @memberof BlockGrid
	 * @instance
	 */
	fromBlockTypeMatrix: function(blockTypeMatrix, checkForNeighbors, startRow, startCol) {
		startRow = startRow || 0;
		startCol = startCol || 0;

		for (var row = 0; row < blockTypeMatrix.length; row++) {
			for (var col = 0; col < blockTypeMatrix[row].length; col++) {
				if (blockTypeMatrix[row][col]) {
					// The add() function knows how to deal with receiving undefined
					this.put(
						Block.blockFromClassId(blockTypeMatrix[row][col]),
						new IgePoint2d(startCol + cow, startRol + row),
						false
					);
				}
			}
		}

		return this;
	},

	put: function(block, location, replace) {
		// Validate parameters
		if (!block) {
			this.log("Invalid block passed to BlockGrid#put.", "warning");
			return;
		}

		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGrid#put.", "warning");
			return;
		}

		var previousBlocks = SparseGrid.prototype.put.call(this, block, location, replace);

		// If previous blocks was null, then this block was placed on top of another block without
		// replacement.
		if (previousBlocks === null) {
			return null;
		}

		this.width(this.gridWidth() * Block.WIDTH);
		this.height(this.gridHeight() * Block.HEIGHT);

		// #ifdef SERVER
		if (ige.isServer) {
			this._addFixture(block);
		}
		// #else
		else {
			this._mountToRenderContainer(block);
		}
		// #endif

		this._translateContainers();

		return previousBlocks;
	},

	remove: function(location, width, height) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGrid#remove.", "warning");
			return;
		}

		// TODO: Remove fixture for the block.

		return SparseGrid.prototype.remove.call(this, location, width, height);
	},

	streamCreateData: function() {
		return this.toJSON();
	},

	_addFixture: function(block) {
		// #ifdef SERVER
		if (ige.isServer) {
			var fixtureDef = this._createFixtureDef(block);

			block.fixtureDef(fixtureDef);

			if (block.fixture() !== undefined) {
				this._box2dBody.DestroyFixture(block.fixture());
			}

			// Add a new fixture based on the new fixture def.
			block.fixture(ige.box2d.addFixture(this._box2dBody, fixtureDef));
		}
		// #endif
	},

	_counteractTranslation: function(translation) {
		// No need to counteract translation for the first block added to the grid!
		// Also, since BlockGrids are streamd to the clients, no reason to translate on the client
		// because this would cause double translation.
		if (this.count() <= 1 || ige.isClient) {
			return;
		}

		// The grid should translate in the opposite direction from the render container.
		var inverted = {x: -translation.x, y: -translation.y};

		var theta = this.rotate().z();

		// Rotate the translation vector based on the current angle of the grid.
		var gridTranslation = {
			x: inverted.x * Math.cos(theta) - inverted.y * Math.sin(theta),
			y: inverted.x * Math.sin(theta) + inverted.y * Math.cos(theta)
		};

		this.translateBy(gridTranslation.x, gridTranslation.y, 0);
	},

	_createFixtureDef: function(block) {
		var coordinates = BlockGrid.coordinatesForBlock(block);
		var width = block.width();
		var height = block.height();
		return {
			density: BlockGrid.BLOCK_FIXTURE_DENSITY,
			friction: BlockGrid.BLOCK_FIXTURE_FRICTION,
			restitution: BlockGrid.BLOCK_FIXTURE_RESTITUTION,
			shape: {
				type: 'rectangle',
				data: {
					x: coordinates.x,
					y: coordinates.y,
					width: width / 2 - BlockGrid.BLOCK_FIXTURE_PADDING,
					height: height / 2 - BlockGrid.BLOCK_FIXTURE_PADDING
				}
			}
		}
	},

	_mountToRenderContainer: function(block) {
		var coordinates = BlockGrid.coordinatesForBlock(block);
		// Attach the block to the render container.
		block.mount(this._renderContainer);
		// Move the block within the render container to the right location.
		block.translateTo(coordinates.x, coordinates.y, 0);
	},

	_translateContainers: function() {
		var topLeftCoordinates = BlockGrid.coordinatesForLocation(this.lowerBound());
		var gridCenter = {
			x: topLeftCoordinates.x - Block.WIDTH / 2 + (this.gridWidth() * Block.WIDTH) / 2,
			y: topLeftCoordinates.y - Block.HEIGHT / 2 + (this.gridHeight() * Block.HEIGHT) / 2
		};

		// #ifdef SERVER
		if (ige.isServer) {
			this._physicsOffset = gridCenter;
		}
		// #else
		else {
			var container = this._renderContainer;
			oldTranslate = {
				x: container.translate().x(),
				y: container.translate().y()
			};
			container.translateTo(-gridCenter.x, -gridCenter.y, 0);
		}
		// #endif
	}
});

/**
 * The default density value of a fixture created for a {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_DENSITY = 1.0;
/**
 * The default friction value of a fixture created for a {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_FRICTION = 0.5;
/**
 * The default restitution value of a fixture created for a {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_RESTITUTION = 0.5;
/**
 * The default padding value of a fixture create for a {@link Block}. Padding defines the difference in space between
 * the rendered {@link Block} and the fixture for that {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_PADDING = .1;

BlockGrid.coordinatesForBlock = function(block) {
	var loc = block.gridData.loc;

	var coordinates = BlockGrid.coordinatesForLocation(loc);

	// Because we need to return the center of the block. For larger blocks, this requires
	// adding as many half blocks as one minus the width of the block.
	coordinates.x += (block.gridData.width - 1) * Block.WIDTH / 2;
	// Because we need to return the center of the block. For larger blocks, this requires
	// adding as many half blocks as one minus the height of the block.
	coordinates.y += (block.gridData.height - 1) * Block.HEIGHT / 2;

	return coordinates;
};

BlockGrid.coordinatesForLocation = function(loc) {
	return {
		// Translates to the horizontal center of the location.
		x: Block.WIDTH * loc.x,
		// Translates to the vertical center of the location.
		y: Block.HEIGHT * loc.y
	}
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
	module.exports = BlockGrid;
}
