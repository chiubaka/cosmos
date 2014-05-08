var ConstructionZoneOverlay = RenderContainer.extend({
	classId: 'ConstructionZoneOverlay',

	_overlayGrid: undefined,
	_grid: undefined,

	init: function (grid) {
		RenderContainer.prototype.init.call(this);
		this._grid = grid;
		this.createConstructionZones();
		this.mountOverlayGrid();
		this.opacity(0.5);
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

	mountOverlayGrid: function() {
		var maxRowLength = this._overlayGrid.get2DMaxRowLength();

		this.height(Block.prototype.HEIGHT * this._overlayGrid.length)
		this.width(Block.prototype.WIDTH * maxRowLength);

		for (var row = 0; row < this._overlayGrid.length; row++) {
			for (var col = 0; col < this._overlayGrid[row].length; col++) {
				var block = this._overlayGrid[row][col];

				if (block === undefined) {
					continue;
				}

				var x = Block.prototype.WIDTH * col - this._bounds2d.x2 + block._bounds2d.x2;
				var y = Block.prototype.HEIGHT * row - this._bounds2d.y2 + block._bounds2d.y2;

				block.translateTo(x, y, 0)
					.mount(this);
			}
		}
	},

	update: function(ctx) {
		if (!ige.isServer) {
			// TODO: Fade in construction overlay when construction capability is
			// detected

			// TODO: Before fading in, if we need to recalculate the overlay, do so
		}

		RenderContainer.prototype.update.call(this, ctx);
	},

});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = ConstructionZoneOverlay; }
