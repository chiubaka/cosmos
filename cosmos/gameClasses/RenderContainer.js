var RenderContainer = IgeEntity.extend({
	classId: 'RenderContainer',

	_blockGrid: undefined,

	getBlockFromBlockGrid: function(row, col) {
		if(row < 0 || col < 0) {
			return undefined;
		}
		if (row >= this._blockGrid.grid().length) {
			return undefined;
		}
		if (col >= this._blockGrid.grid()[0].length) {
			return undefined;
		}

		return this._blockGrid.grid()[row][col];
	},

	/*
	* The general strategy for handling clicks is to:
	* 1. Unrotate the click coordinate
	* 2. Compare the unrotated click coordinate to where the blocks would be if the BlockGrid were not rotated
	* 3. Fire the mouseDown() event on the appropriate block
	*/
	mouseDownHandler: function(event, control) {
		// event.igeBaseX and event.igeBaseY give coordinates relative to the clicked entity's origin (center)

		// The position of the click in world coordinates
		var mousePosWorld = this._blockGrid.mousePosWorld();
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

		// This is the BlockGrid's rotation, not the render container's, since the render container does
		// not rotate with respect to its parent.
		// Negative because we want to reverse the rotation.
		var theta = -this._blockGrid._rotate.z;

		// The unrotated coordinates for comparison against an unrotated grid with respect to the center of the
		// entity
		// This uses basic trigonometry. See http://en.wikipedia.org/wiki/Rotation_matrix.
		var unrotatedX = aabbRelativeX * Math.cos(theta) - aabbRelativeY * Math.sin(theta);
		var unrotatedY = aabbRelativeX * Math.sin(theta) + aabbRelativeY * Math.cos(theta);

		// Height and width of the grid area
		var width = this._blockGrid.width();
		var height = this._blockGrid.height();

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

		var block = this._blockGrid._grid[row][col];

		if (block === undefined) {
			return;
		}

		// TODO: This might be dangerous, since some of the event properties should be changed so that they are
		// relative to the child's bounding box, but since we don't use any of those properties for the moment,
		// ignore that.
		if (this.getBlockFromBlockGrid(row+1, col) == undefined ||
				this.getBlockFromBlockGrid(row-1, col) == undefined ||
				this.getBlockFromBlockGrid(row, col+1) == undefined ||
				this.getBlockFromBlockGrid(row, col-1) == undefined) {
			block.mouseDown(event, control);
			this.cacheDirty(true);

			//TODO this doesn't quite work yet. It was supposed to stop the propagation. It doesn’t stop the propagation. I know that because I can click and still create a block even if I am clicking on an existing block.
			control.stopPropagation();
			ige.input.stopPropagation();
		}
	},

	blockGrid: function(newBlockGrid) {
		if (newBlockGrid == undefined) {
			return this._blockGrid;
		}

		this._blockGrid = newBlockGrid;
		return this;
	},

	init: function () {
		IgeEntity.prototype.init.call(this);

		this.mouseDown(this.mouseDownHandler);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RenderContainer; }
