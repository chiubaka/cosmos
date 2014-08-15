/**
 * An {@link IgeEntity} which helps to display the construction hints to users when they click on the construct button.
 * @class
 * @typedef {ConstructionOverlay}
 * @namespace
 */
var ConstructionOverlay = IgeEntity.extend({
	classId: 'ConstructionOverlay',

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

		this.addComponent(ConstructionOverlayRenderableComponent);

		this.mouseDown(this._mouseDownHandler);

		var self = this;
		ige.on('capbar cap selected', function(classId) {
			if (classId === 'ConstructCap') {
				self.refresh();
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
			this.refresh();
			this.show();
		}
		else {
			this.hide();
		}
	},

	gridHeight: function() {
		return this._structure.gridHeight() + 2 * this._blockHeight;
	},

	gridWidth: function() {
		return this._structure.gridWidth() + 2 * this._blockWidth;
	},

	lowerBound: function() {
		var structureLowerBound = this._structure.lowerBound();
		return {
			x: structureLowerBound.x - this._blockWidth,
			y: structureLowerBound.y - this._blockHeight
		};
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

	refresh: function() {
		this.overlayForBlock(
			cosmos.blocks.instances[ige.hud.leftToolbar.windows.cargo.selectedType]
		);
	},

	upperBound: function() {
		var structureUpperBound = this._structure.upperBound();
		return {
			x: structureUpperBound.x + this._blockWidth,
			y: structureUpperBound.y + this._blockHeight
		}
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
	 * Handles clicks on this object.
	 * @param event {Object} The event object associated with the click.
	 * @param control {Object} The control object associated with the click.
	 * @memberof ConstructionOverlay
	 * @private
	 */
	_mouseDownHandler: function(event, control) {
		if (this.renderable._hidden) {
			return;
		}

		var clickLocation = this._structure.locationForClick(event, control);

		var location = {
			x: clickLocation.x - this.lowerBound().x,
			y: clickLocation.y - this.lowerBound().y
		};

		// Don't continue if the location is out of our acceptable bounds.
		if (location.x < 0 || location.y < 0
			|| location.x >= this.gridWidth() || location.y >= this.gridHeight())
		{
			return;
		}

		// A 1 in a construction location means it was a valid location.
		if (this._constructionLocations && this._constructionLocations[location.x][location.y]) {
			// Don't let this mouse click bubble down.
			control.stopPropagation();
		}
		else {
			return;
		}

		// Send constructionZoneClicked message to server
		var data = {
			blockGridId: this._parent.id(),
			// Translate overlay coordinates into BlockGrid coordinates
			row: location.y + this._structure.lowerBound().y - 1,
			col: location.x + this._structure.lowerBound().x - 1
		};

		if (ige.isClient && ige.client !== undefined && ige.client.state !== undefined) {
			ige.client.state.currentCapability().tryPerformAction(this, event, data);
		}
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
