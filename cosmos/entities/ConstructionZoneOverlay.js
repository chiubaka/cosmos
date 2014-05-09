var ConstructionZoneOverlay = IgeEntity.extend({
	classId: 'ConstructionZoneOverlay',

	_overlayGrid: undefined,
	_grid: undefined,
	_renderContainer: undefined,
	_refreshNeeded: false,

	init: function (grid) {
		IgeEntity.prototype.init.call(this);
		this._grid = grid;
		this._renderContainer = new RenderContainer()
			.mount(this)
			.opacity(0.5);
		this.createConstructionZones();
		this.mountOverlayGrid();
		this.mouseDown(this.mouseDownHandler);
	},

	createConstructionZones: function() {
		//First create an array that's two larger in each dimensions than the current grid
		var gridNumRows = this._grid.length;
		var gridNumCols = this._grid.get2DMaxRowLength();

		var overlayNumRows = gridNumRows + 2;
		var overlayNumCols = gridNumCols + 2;

		this._overlayGrid = Array.prototype.new2DArray(overlayNumRows, overlayNumCols);

		//Traverse the two dimensional array looking for spaces where the following
		// conditions hold:
		// (1) The space is undefined
		// (2) The space has a 4-neighbor that is defined
		// This is a image processing operation called morphological dilation
		for (var row = 0; row < overlayNumRows; row++) {
			for (var col = 0; col < overlayNumCols; col++) {
				var gridRow = row - 1;
				var gridCol = col - 1;
				if (this._grid.get2D(gridRow, gridCol) === undefined){
					if (this._grid.get2D(gridRow + 1, gridCol) ||
							this._grid.get2D(gridRow, gridCol + 1) ||
							this._grid.get2D(gridRow - 1, gridCol) ||
							this._grid.get2D(gridRow, gridCol - 1)) {
						this._overlayGrid[row][col] = new ConstructionZoneBlock();
					}
				}
			}
		}
	},

	// TODO: Consolidate this function with the BlockGrid one
	mountOverlayGrid: function() {
		var maxRowLength = this._overlayGrid.get2DMaxRowLength();

		this.height(Block.prototype.HEIGHT * this._overlayGrid.length);
		this.width(Block.prototype.WIDTH * maxRowLength);
		this._renderContainer.height(this.height());
		this._renderContainer.width(this.width());

		for (var row = 0; row < this._overlayGrid.length; row++) {
			for (var col = 0; col < this._overlayGrid[row].length; col++) {
				var block = this._overlayGrid[row][col];

				if (block === undefined) {
					continue;
				}

				var x = Block.prototype.WIDTH * col - this._bounds2d.x2 + block._bounds2d.x2;
				var y = Block.prototype.HEIGHT * row - this._bounds2d.y2 + block._bounds2d.y2;

				block.translateTo(x, y, 0)
					.mount(this._renderContainer);
			}
		}
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

		var row = Math.floor(gridY / Block.prototype.HEIGHT);
		var col = Math.floor(gridX / Block.prototype.WIDTH);

		var block = this._overlayGrid[row][col];

		// Check if we have clicked on a valid construction zone.
		// If so, stop click propogation so we don't hit the ClickScene
		if (block === undefined) {
			return;
		}
		else {
			control.stopPropagation();
		}

		// Send constructionZoneClicked message to server
		var data = {
			blockGridId: this._parent.id(),
			// Translate overlay coordinates into BlockGrid coordinates
			row: row - 1,
			col: col - 1,
			// TODO: Vary block type
			blockClassId: 'IronBlock'
		};

		ige.network.send('constructionZoneClicked', data);
	},

	refreshNeeded: function (val) {
	if (val !== undefined) {
			this._refreshNeeded = val;
			return this;
		}
		return this._refreshNeeded;
	},

	update: function(ctx) {
		if (!ige.isServer) {
			// TODO: Fade in construction overlay when construction capability is
			// detected

			// TODO: Before fading in, if we need to recalculate the overlay, do so
			// TODO: Local refresh. Global refresh is slow with large BlockGrids
			if (this._refreshNeeded) {
				this._renderContainer.destroy();
				this._renderContainer = new RenderContainer()
					.mount(this)
					.opacity(0.5);
				this.createConstructionZones();
				this._renderContainer.cacheDirty(true);
				this.mountOverlayGrid();
				this._refreshNeeded = false;
			}
		}

		IgeEntity.prototype.update.call(this, ctx);
	}

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ConstructionZoneOverlay; }
