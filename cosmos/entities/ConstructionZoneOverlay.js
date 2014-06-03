var ConstructionZoneOverlay = IgeEntity.extend({
	classId: 'ConstructionZoneOverlay',

	_overlayGrid: undefined,
	_blockGrid: undefined,
	_renderContainer: undefined,

	init: function (blockGrid) {
		IgeEntity.prototype.init.call(this);
		this._blockGrid = blockGrid;
		this._renderContainer = new RenderContainer()
			.mount(this)
			.opacity(0.5);
		this.createConstructionZones();
		this.mountOverlayGrid();
		this.mouseDown(this.mouseDownHandler);

		var self = this;
		ige.on('capbar cap selected', function(classId) {
			if (classId === 'ConstructCap') {
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

		// Hide the construction zone overlays initially
		this.hide();
	},

	createConstructionZones: function() {
		var overlayNumRows = this._blockGrid.numRows() + 2;
		var overlayNumCols = this._blockGrid.numCols() + 2;

		this._overlayGrid = Array.prototype.new2DArray(overlayNumRows, overlayNumCols);

		var constructionZoneLocations = this._blockGrid.constructionZoneLocations();
		for (var i = 0; i < constructionZoneLocations.length; i++) {
			var location = constructionZoneLocations[i];
			var row = location.row - this._blockGrid.startRow() + 1;
			var col = location.col - this._blockGrid.startCol() + 1;
			this._overlayGrid[row][col] = new ConstructionZoneBlock();
		}
	},

	// TODO: Consolidate this function with the BlockGrid one
	mountOverlayGrid: function() {
		var maxRowLength = this._overlayGrid.get2DMaxRowLength();

		this.height(Block.HEIGHT * this._overlayGrid.length);
		this.width(Block.WIDTH * maxRowLength);
		this._renderContainer.height(this.height());
		this._renderContainer.width(this.width());

		for (var row = 0; row < this._overlayGrid.length; row++) {
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
		}
		this._renderContainer.refresh();
	},

	// TODO: Consolidate this function with the BlockGrid one
	mouseDownHandler: function(event, control) {
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

	// Recalculate construction zones. Called upon removal or addition of blocks
	// to the BlockGrid.
	refresh: function () {
		this._renderContainer.destroy();
		this._renderContainer = new RenderContainer()
			.mount(this)
			.opacity(0.5);
		this.createConstructionZones();
		this.mountOverlayGrid();
	}

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ConstructionZoneOverlay; }
