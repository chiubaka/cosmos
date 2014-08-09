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

		console.log(ige.isServer);

		// #ifdef CLIENT
		if (ige.isClient) {
			console.log("Init client!");
			// Create the render container and mount it to this entity.
			this._renderContainer = new RenderContainer();
			this._renderContainer.width(0);
			this._renderContainer.height(0);
			this._renderContainer.mount(this);
		}
		// #else
		else {
			console.log("Init server!");
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

		this._mountToRenderContainer(block);
		this._addFixture(block);

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

		var oldTranslate = {
			x: this._renderContainer.translate().x(),
			y: this._renderContainer.translate().y()
		};

		// #ifdef SERVER
		if (ige.isServer) {
			this._physicsContainer.translateTo(-gridCenter.x, -gridCenter.y, 0);
		}
		// #else
		else {
			this._renderContainer.translateTo(-gridCenter.x, -gridCenter.y, 0);
		}
		// #endif

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
