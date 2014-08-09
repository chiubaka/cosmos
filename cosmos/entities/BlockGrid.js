var BlockGrid = IgeEntity.extend({
	classId: "BlockGrid",

	_grid: undefined,
	_lowerLocBound: undefined,
	_physicsContainer: undefined,
	_renderContainer: undefined,
	_upperLocBound: undefined,

	init: function(data) {
		IgeEntity.prototype.init.call(this, data);

		this._grid = new SparseGrid();

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
				this._grid.fromJSON(Block, data);
			}
		}
		// #else
		else {
			this._physicsContainer = new BlockGridPhysicsContainer();
			this._physicsContainer.mount(this);
		}
		// #endif
	},

	count: function() {
		return this._grid.count();
	},

	each: function(func, location, width, height) {
		return this._grid.each(func, location, width, height);
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

	get: function(location, width, height) {
		return this._grid.get(location, width, height);
	},

	has: function(location, width, height) {
		return this._grid.has(location, width, height);
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

		var previousBlocks = this._grid.put(block, location, replace);

		// If previous blocks was null, then this block was placed on top of another block without
		// replacement.
		if (previousBlocks === null) {
			return null;
		}

		this.width(this._grid.width() * Block.WIDTH);
		this.height(this._grid.height() * Block.HEIGHT);

		// #ifdef SERVER
		if (ige.isServer) {
			this._addFixture(block);
		}
		// #else
		else {
			this._mountToRenderContainer(block);
		}
		// #endif

		var translation = this._translateContainers();

		this._counteractTranslation(translation);

		return previousBlocks;
	},

	remove: function(location, width, height) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGrid#remove.", "warning");
			return;
		}

		// TODO: Remove fixture for the block.

		return this._grid.remove(location, width, height);
	},

	streamCreateData: function() {
		return this.toJSON();
	},

	toJSON: function() {
		return this._grid.toJSON();
	},

	_addFixture: function(block) {
		// #ifdef SERVER
		if (ige.isServer) {
			this._physicsContainer.addFixture(block);
		}
		// #endif
	},

	_counteractTranslation: function(translation) {
		// No need to counteract translation for the first block added to the grid!
		if (this.count() <= 1) {
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

	_mountToRenderContainer: function(block) {
		var coordinates = BlockGrid.coordinatesForBlock(block);
		// Attach the block to the render container.
		block.mount(this._renderContainer);
		// Move the block within the render container to the right location.
		block.translateTo(coordinates.x, coordinates.y, 0);
	},

	_translateContainers: function() {
		var topLeftCoordinates = BlockGrid.coordinatesForLocation(this._grid.lowerBound());
		var gridCenter = {
			x: topLeftCoordinates.x - Block.WIDTH / 2 + (this._grid.width() * Block.WIDTH) / 2,
			y: topLeftCoordinates.y - Block.HEIGHT / 2 + (this._grid.height() * Block.HEIGHT) / 2
		};

		var container;

		// #ifdef SERVER
		if (ige.isServer) {
			container = this._physicsContainer;
		}
		// #else
		else {
			container = this._renderContainer;
		}
		// #endif

		var oldTranslate = {
			x: container.translate().x(),
			y: container.translate().y()
		};
		container.translateTo(-gridCenter.x, -gridCenter.y, 0);

		// Return the amount the render container was translated by. These equations amount to
		// new render container translate minus old render container translate.
		return {
			x: -gridCenter.x - oldTranslate.x,
			y: -gridCenter.y - oldTranslate.y
		};
	}
});

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
