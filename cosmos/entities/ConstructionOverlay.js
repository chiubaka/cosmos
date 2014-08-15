/**
 * An {@link IgeEntity} which helps to display the construction hints to users when they click on the construct button.
 * @class
 * @typedef {ConstructionOverlay}
 * @namespace
 */
var ConstructionOverlay = IgeEntity.extend({
	classId: 'ConstructionOverlay',

	_dirty: undefined,
	/**
	 * A reference to the {@link BlockStructure} object that this {@link ConstructionOverlay} is displaying an overlay
	 * for.
	 * @type {BlockStructure}
	 * @memberof ConstructionOverlay
	 * @private
	 * @instance
	 */
	_structure: undefined,

	init: function(structure) {
		IgeEntity.prototype.init.call(this);
		this._structure = structure;
		this._dirty = false;

		this.addComponent(ConstructionOverlayRenderableComponent);

		this.mouseDown(this._mouseDownHandler);

		var self = this;
		ige.on('capbar cap selected', function(classId) {
			if (classId === 'ConstructCap') {
				self.overlayForBlock(
					cosmos.blocks.instances[ige.hud.leftToolbar.windows.cargo.selectedType]
				);
				self.show();
			} else {
				self.hide();
			}
		});
		
		ige.on('capbar cap cleared', function(classId) {
			if (classId === 'ConstructCap') {
				self.hide();
			}
		});

		// If construct capability enabled, show the construction zones
		if (ige.client.state.selectedCap() === 'construct') {
			this.show();
		}
		else {
			this.hide();
		}
	},

	overlayForBlock: function(block) {
		var blockWidth = 1;
		var blockHeight = 1;

		if (block) {
			blockWidth = block.gridData.width;
			blockHeight = block.gridData.height;
		}

		this._blockWidth = blockWidth;
		this._blockHeight = blockHeight;

		this._computeConstructionLocations(blockWidth, blockHeight);
		this.renderable.renderConstructionLocations();
	},

	_computeConstructionLocations: function(blockWidth, blockHeight) {
		var filter = ConstructionOverlay.constructionFilter(blockWidth, blockHeight);

		var filterWidth = blockWidth + 2;
		var filterHeight = blockHeight + 2;
		var width = this._structure.gridWidth() + 2 * (blockWidth);
		var height = this._structure.gridHeight() + 2 * (blockHeight);
		var result = Array.prototype.new2DArray(width, height, 0);

		var lowerBound = this._structure.lowerBound();
		var resultLowerBound = {
			x: lowerBound.x - blockWidth,
			y: lowerBound.y - blockHeight
		};

		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				// The corners will never work, so don't bother checking them.
				if ((x === 0 && y === 0)
					|| (x === 0 && y === height - 1)
					|| (x === width - 1 && y === 0)
					|| (x === width - 1 && y === height - 1))
				{
					continue;
				}

				var sum = 0;
				for (var filterX = 0; filterX < filterWidth; filterX++) {
					for (var filterY = 0; filterY < filterHeight; filterY++) {
						var value = this._structure.has(
							new IgePoint2d(
									resultLowerBound.x + x + filterX - 1,
									resultLowerBound.y + y + filterY - 1
							)
						) ? 1 : 0;
						sum += filter[filterX][filterY] * value;
					}
				}

				if (sum > 0) {
					for (var blockX = 0; blockX < blockWidth; blockX++) {
						for (var blockY = 0; blockY < blockHeight; blockY++) {
							var indexX = x + blockX;
							var indexY = y + blockY;
							if (indexX < width && indexY < height) {
								result[indexX][indexY] = 1;
							}
						}
					}
				}
			}
		}

		this.width(width * Block.WIDTH);
		this.height(height * Block.HEIGHT);
		this._constructionLocations = result;
	},

	/**
	 * Processes the associated {@link BlockGrid} to figure out where to place {@link ConstructionZoneBlock}s to add
	 * to the {@link ConstructionOverlay#_overlayGrid|_overlayGrid}.
	 * @memberof ConstructionOverlay
	 * @private
	 * @instance
	 */
	_createConstructionZones: function() {
		// We want a buffer of size 1 on the top, bottom, right, and left. Hence the +2s everywhere.
		var overlayNumRows = this._blockGrid.gridWidth() + 2;
		var overlayNumCols = this._blockGrid.gridHeight() + 2;

		this._overlayGrid = Array.prototype.new2DArray(overlayNumCols, overlayNumRows);

		var constructionZoneLocations = this._blockGrid.constructionZoneLocations();
		for (var i = 0; i < constructionZoneLocations.length; i++) {
			var location = constructionZoneLocations[i];
			var lowerBound = this._blockGrid.lowerBound();
			var row = location.y - lowerBound.y + 1;
			var col = location.x - lowerBound.x + 1;
			this._overlayGrid[col][row] = new ConstructionZoneBlock();
		}
	},

	/**
	 * Mounts the overlay grid and {@link ConstructionZoneBlock}s.
	 * @memberof ConstructionOverlay
	 * @private
	 * @instance
	 * @todo Consolidate this function with its {@link BlockGrid} counterpart.
	 */
	_mountOverlayGrid: function() {
		var maxRowLength = this._overlayGrid.get2DMaxRowLength();

		this.height(Block.HEIGHT * this._overlayGrid.length);
		this.width(Block.WIDTH * maxRowLength);
		this._renderContainer.height(this.height());
		this._renderContainer.width(this.width());

		for (var col = 0; col < this._overlayGrid.length; col++) {
			for (var row = 0; row < this._overlayGrid[col].length; row++) {
				var block = this._overlayGrid[col][row];

				if (block === undefined) {
					continue;
				}

				var x = Block.WIDTH * col - this._bounds2d.x2 + block._bounds2d.x2;
				var y = Block.HEIGHT * row - this._bounds2d.y2 + block._bounds2d.y2;

				block.translateTo(x, y, 0)
					.mount(this._renderContainer);
			}
		}

		/*for (var row = 0; row < this._overlayGrid.length; row++) {
			for (var col = 0; col < this._overlayGrid[row].length; col++) {
				var block = this._overlayGrid[row][col];

				if (block === undefined) {
					continue;
				}

				var x = Block.WIDTH * col - this._bounds2d.x2 + block._bounds2d.x2;
				var y = Block.HEIGHT * row - this._bounds2d.y2 + block._bounds2d.y2;

				block.translateTo(x, y, 0)
					.mount(this._renderContainer);
			}
		}*/
		this._renderContainer.refresh();
	},

	/**
	 * Handles clicks on this object.
	 * @param event {Object} The event object associated with the click.
	 * @param control {Object} The control object associated with the click.
	 * @memberof ConstructionOverlay
	 * @private
	 * @todo Consolidate this function with its {@link BlockGrid} counterpart.
	 */
	_mouseDownHandler: function(event, control) {
		// event.igeBaseX and event.igeBaseY give coordinates relative to the clicked entity's origin (center)

		// The position of the click in world coordinates
		var mousePosWorld = this.mousePosWorld();
		var worldX = mousePosWorld.x;
		var worldY = mousePosWorld.y;

		// The coordinates of the center of the axis-aligned bounding box of the render container in
		// world coordinates
		var aabb = this.aabb();
		var aabbX = aabb.x + aabb.width / 2;
		var aabbY = aabb.y + aabb.height / 2;

		// Translate the mouse position to a reference system where the center of the axis-aligned
		// bounding box is the center
		var aabbRelativeX = worldX - aabbX;
		var aabbRelativeY = worldY - aabbY;

		// This is the overlay's parent's rotation, since the overlay has no
		// no rotation with respect to the BlockGrid.
		// Negative because we want to reverse the rotation.

		// Negative because we want to reverse the rotation.
		var theta = -this._parent._rotate.z;

		// The unrotated coordinates for comparison against an unrotated grid with respect to the center of the
		// entity
		// This uses basic trigonometry. See http://en.wikipedia.org/wiki/Rotation_matrix.
		var unrotatedX = aabbRelativeX * Math.cos(theta) - aabbRelativeY * Math.sin(theta);
		var unrotatedY = aabbRelativeX * Math.sin(theta) + aabbRelativeY * Math.cos(theta);

		// Height and width of the grid area
		var width = this.width();
		var height = this.height();

		// Check if the click was out of the grid area (happens because axis-aligned bounding boxes are larger
		// than the non-axis-aligned grid area)
		if (Math.abs(unrotatedX) > width / 2
			|| Math.abs(unrotatedY) > height / 2) {
			return;
		}

		// Coordinates for the top left corner of the grid area
		var topLeftCornerX = -width / 2;
		var topLeftCornerY = -height / 2;

		// Coordinates of the unrotated clicked point with respect to the top left of the grid area
		// This is just so calculations are a little bit easier
		var gridX = unrotatedX - topLeftCornerX;
		var gridY = unrotatedY - topLeftCornerY;

		var row = Math.floor(gridY / Block.HEIGHT);
		var col = Math.floor(gridX / Block.WIDTH);

		var block = this._overlayGrid[row][col];

		// Check if we have clicked on a valid construction zone.
		// If so, stop click propogation so we don't hit the ClickScene
		if (block === undefined) {
			return;
		} else {
			control.stopPropagation();
		}

		// Send constructionZoneClicked message to server
		var data = {
			blockGridId: this._parent.id(),
			// Translate overlay coordinates into BlockGrid coordinates
			row: row + this._blockGrid.startRow() - 1,
			col: col + this._blockGrid.startCol() - 1,
		};

		if (ige.isClient && ige.client !== undefined && ige.client.state !== undefined) {
			ige.client.state.currentCapability().tryPerformAction(this, event, data);
		}
	},

	/**
	 * Recalculate construction zones. Called upon removal or addition of {@link Block}s to the {@link BlockGrid}.
	 * @memberof ConstructionOverlay
	 * @instance
	 */
	refresh: function () {
		this._renderContainer.destroy();
		this._renderContainer = new RenderContainer()
			.mount(this)
		this._createConstructionZones();
		this._mountOverlayGrid();
	}
});


ConstructionOverlay.constructionFilter = function(blockWidth, blockHeight) {
	var width = blockWidth + 2;
	var height = blockHeight + 2;
	var filter = Array.prototype.new2DArray(width, height);

	// Set the corners to 0.
	filter[0][0] = 0;
	filter[0][height - 1] = 0;
	filter[width - 1][0] = 0;
	filter[width - 1][height - 1] = 0;

	// Set the top and bottom sides to 1.
	for (var col = 1; col < width - 1; col++) {
		filter[col][0] = 1;
		filter[col][height - 1] = 1;
	}

	// Set the left and right sides to 1.
	for (var row = 1; row < height - 1; row++) {
		filter[0][row] = 1;
		filter[width - 1][row] = 1;
	}

	// The value we place at the locations that the block would occupy.
	var negationValue = -(blockWidth * 2 + blockHeight * 2 + 1);

	for (var col = 1; col < width - 1; col++) {
		for (var row = 1; row < height - 1; row++) {
			filter[col][row] = negationValue;
		}
	}

	return filter;
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ConstructionOverlay; }
