// TODO: Find and replace BlockGridNew with BlockGrid once this class completely takes the place of the old BlockGrid.

var BlockGridNew = IgeEntityBox2d.extend({
	classId: "BlockGridNew",

	_grid: undefined,
	_lowerLocBound: undefined,
	_renderContainer: undefined,
	_upperLocBound: undefined,

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		this._grid = new SparseGrid();

		this.width(0);
		this.height(0);

		// #ifdef CLIENT
		if (ige.isClient) {
			// Create the render container and mount it to this entity.
			this._renderContainer = new RenderContainer();
			this._renderContainer.width(0);
			this._renderContainer.height(0);
			this._renderContainer.mount(this);
		}
		// #endif
		this._renderContainer = new RenderContainer();

		// TODO: Create Box2dBody

		// TODO: Finish BlockGridNew initialization.
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
			this.log("Invalid block passed to BlockGridNew#put.", "warning");
			return;
		}

		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#put.", "warning");
			return;
		}

		var oldLowerBound = this._grid.lowerBound();
		var oldUpperBound = this._grid.upperBound();

		var previousBlocks = this._grid.put(block, location, replace);

		// If previous blocks was null, then this block was placed on top of another block without
		// replacement.
		if (previousBlocks === null) {
			return null;
		}

		this.width(this._grid.width() * Block.WIDTH);
		this.height(this._grid.height() * Block.HEIGHT);

		this._mountToRenderContainer(block);

		var translation = this._translateRenderContainer();

		this._counteractTranslation(translation);

		// TODO: Add a fixture for the block.

		// TODO: Translate blocks to the right place within the BlockGrid based on row and column.

		// TODO: Modify this so that it places several references to blocks that are larger than
		// 1x1
		return previousBlocks;
	},

	remove: function(location, width, height) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGridNew#get.", "warning");
			return;
		}

		// TODO: Remove fixture for the block.

		return this._grid.remove(location, width, height);
	},

	_counteractTranslation: function(translation) {
		// The grid should translate in the opposite direction from the render container.
		var inverted = {x: -translation.x, y: -translation.y};

		var theta = this.rotate().z();

		// Rotate the translation vector based on the current angle of the grid.
		var gridTranslation = {
			x: inverted.x * Math.cos(theta) - inverted.y * Math.sin(theta),
			y: inverted.x * Math.sin(theta) + inverted.y * Math.cos(theta)
		};

		this.translateBy(gridTranslation.x, gridTranslation.y);
	},

	_gridCoordinatesForBlock: function(block) {
		// If there are no blocks in this grid yet, then the grid coordinates should always be
		// (0, 0).
		if (this.count() === 0) {
			return {x: 0, y: 0};
		}

		var relLoc = this._grid.relativeLocation(block.gridData.loc);

		var coordinates =
		{
			x: Block.WIDTH * relLoc.x - this._bounds2d.x2 + block._bounds2d.x2,
			y: Block.HEIGHT * relLoc.y - this._bounds2d.y2 + block._bounds2d.y2
		};

		return coordinates;
	},

	_mountToRenderContainer: function(block) {
		var renderCoordinates = this._renderCoordinatesForBlock(block);
		// Attach the block to the render container.
		block.mount(this._renderContainer);
		// Move the block within the render container to the right location.
		block.translateTo(renderCoordinates.x, renderCoordinates.y, 0);
	},

	_renderCoordinatesForBlock: function(block) {
		var loc = block.gridData.loc;

		var renderCoordinates = this._renderCoordinatesForLocation(loc);

		// Because we need to return the center of the block. For larger blocks, this requires
		// adding as many half blocks as one minus the width of the block.
		renderCoordinates.x += (block.gridData.width - 1) * Block.WIDTH / 2;
		// Because we need to return the center of the block. For larger blocks, this requires
		// adding as many half blocks as one minus the height of the block.
		renderCoordinates.y += (block.gridData.height - 1) * Block.HEIGHT / 2;

		return renderCoordinates;
	},

	_renderCoordinatesForLocation: function(loc) {
		return {
			// Translates to the horizontal center of the location.
			x: Block.WIDTH * loc.x,
			// Translates to the vertical center of the location.
			y: Block.HEIGHT * loc.y
		}
	},

	_translateRenderContainer: function() {
		var topLeftCoordinates = this._renderCoordinatesForLocation(this._grid.lowerBound());
		var renderCenter = {
			x: topLeftCoordinates.x + (this._grid.width() * Block.WIDTH) / 2,
			y: topLeftCoordinates.y + (this._grid.height() * Block.HEIGHT) / 2
		};

		var translation = {
			x: 0,
			y: 0
		};

		if (this.count() > 1) {
			translation.x = this._renderContainer.translate().x() + renderCenter.x;
			translation.y = this._renderContainer.translate().y() + renderCenter.y;
			this._renderContainer.translateBy(translation.x, translation.y);
		}
		else {
			this._renderContainer.translateTo(-renderCenter.x, -renderCenter.y);
		}

		return translation;
	}
});

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") { module.exports = BlockGridNew; }
