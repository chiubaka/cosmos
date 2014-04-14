var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	/** Contains the grid of Block objects that make up this BlockGrid */
	_grid: [],
	/** Contains the Box2D physics fixtures for this block grid */
	_fixtures: [],
	/** The rendering container for this BlockGrid, which essentially provides a cacheable location for the BlockGrid's
	 * texture. */
	_renderContainer: undefined,

	_debugFixtures: false,

	init: function(data) {
		var self = this;

		IgeEntityBox2d.prototype.init.call(this);

		if (data !== undefined) {
			this.gridFromStreamCreateData(data);
		}

		if (!ige.isServer) {
			this._renderContainer = new IgeEntity()
				.compositeCache(true)
				.mount(this);

			/*
			 * The general strategy for handling clicks is to:
			 * 1. Unrotate the click coordinate
			 * 2. Compare the unrotated click coordinate to where the blocks would be if the BlockGrid were not rotated
			 * 3. Fire the mouseDown() event on the appropriate block
			 */
			this._renderContainer.mouseDown(function(event, control) {
				// event.igeBaseX and event.igeBaseY give coordinates relative to the clicked entity's origin (center)

				// The position of the click in world coordinates
				var mousePosWorld = self.mousePosWorld();
				var worldX = mousePosWorld.x;
				var worldY = mousePosWorld.y;

				// The coordinates of the center of the axis-aligned bounding box of the render container in
				// world coordinates
				var aabb = self._renderContainer.aabb();
				var aabbX = aabb.x + aabb.width / 2;
				var aabbY = aabb.y + aabb.height / 2;

				// Translate the mouse position to a reference system where the center of the axis-aligned
				// bounding box is the center
				var aabbRelativeX = worldX - aabbX;
				var aabbRelativeY = worldY - aabbY;

				// This is the BlockGrid's rotation, not the render container's, since the render container does
				// not rotate with respect to its parent.
				// Negative because we want to reverse the rotation.
				var theta = -self._rotate.z;

				// The unrotated coordinates for comparison against an unrotated grid with respect to the center of the
				// entity
				// This uses basic trigonometry. See http://en.wikipedia.org/wiki/Rotation_matrix.
				var unrotatedX = aabbRelativeX * Math.cos(theta) - aabbRelativeY * Math.sin(theta);
				var unrotatedY = aabbRelativeX * Math.sin(theta) + aabbRelativeY * Math.cos(theta);

				// Height and width of the grid area
				var width = self._renderContainer.width();
				var height = self._renderContainer.height();

				// Check if the click was out of the grid area (happens because axis-aligned bounding boxes are larger
				// than the non-axis-aligned grid area)
				if (Math.abs(unrotatedX) > width / 2
					|| Math.abs(unrotatedY) > height / 2)
				{
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

				var block = self._grid[row][col];

				if (block === undefined) {
					return;
				}

				// TODO: This might be dangerous, since some of the event properties should be changed so that they are
				// relative to the child's bounding box, but since we don't use any of those properties for the moment,
				// ignore that.
				block._mouseDown(event, control);
				self._renderContainer.cacheDirty(true);
			});

			this.mountGrid();
		}
	},

	streamCreateData: function() {
		return this.streamCreateDataFromGrid(this._grid);
	},

	streamCreateDataFromGrid: function(grid) {
		var data = [];
		for (var i = 0; i < grid.length; i++) {
			var row = [];
			for (var j = 0; j < grid[i].length; j++) {
				var block = grid[i][j];
				if (block === undefined) {
					row.push(undefined);
					continue;
				}
				row.push(block.classId());
			}
			data.push(row);
		}
		return data;
	},

	gridFromStreamCreateData: function(data) {
		this._grid = [];
		for (var i = 0; i < data.length; i++) {
			var row = [];
			for (var j = 0; j < data[i].length; j++) {
				var classId = data[i][j];

				var block = Block.prototype.blockFromClassId(classId)

				if (block !== undefined) {
					block.row(i).col(j);
				}

				row.push(block);
			}
			this._grid.push(row);
		}
	},

	/**
	Static function
	Returns a new block grid with the given dimensions.

	POTENTIAL BUG: are numCols and numRows swithed?
	*/
	newGridFromDimensions: function (numCols, numRows) {
		var grid = [];

		for (x = 0; x < numCols; x++) {
			var gridCol = [];
			for (y = 0; y < numRows; y++) {
				gridCol.push(new EngineBlock());
			}
			grid.push(gridCol);
		}

		return grid;
	},

	processBlockAction: function(data) {
		switch (data.action) {
			case 'remove':
				this.remove(data.row, data.col);
				break;
			default:
				this.log('Cannot process block action ' + data.action + ' because no such action exists.', 'warning');
		}
	},

	/**
	 * Remove is intended to remove the block from the grid,
	 * and also remove the fixture from the list of fixtures in the box2D object.
	 */
	remove: function(row, col) {
		var block = this._grid[row][col];

		if (!ige.isServer && block !== undefined) {
			block.unMount();
			this._renderContainer.cacheDirty(true);
		}
		this._grid[row][col] = undefined;
	},

	/**
	 * Getter/setter for the grid property of the BlockGrid. If a parameter is passed, sets
	 * the property and returns this. If not, returns the property.
	 * @parameter grid the grid to set (optional)
	 * @return this if we set the grid or the current grid otherwise
	 */
	grid: function(grid) {
		if (grid === undefined) {
			return this._grid;
		}

		this._grid = grid;

		this._fixtures = [];

		var maxRowLength = this.maxRowLengthForGrid(this._grid);

		this.height(Block.prototype.HEIGHT * this._grid.length)
			.width(Block.prototype.WIDTH * maxRowLength);

		for(var row = 0; row < this._grid.length; row++)
		{
			var blockList = this._grid[row];
			for(var col = 0; col < blockList.length; col++)
			{
				var block = blockList[col];

				if (block === undefined) {
					continue;
				}


				var width = Block.prototype.WIDTH;
				var height = Block.prototype.HEIGHT;

				var x = width * col - this._geometry.x2 + block._geometry.x2;
				var y = height * row - this._geometry.y2 + block._geometry.y2;

				var fixture = {
					density: 1.0,
					friction: 0.5,
					restitution: 0.5,
					shape: {
						type: 'rectangle',
						data: {
							// The position of the fixture relative to the body
							x: x,
							y: y,
							width: width / 2, //I don't know why we have to devide by two here to make this come out right : (
							height: height / 2
						}
					}
				};
				this._fixtures.push(fixture);

				self = this;
				block.onDeath = function() {
					self.remove(block, fixture)
				};

				if (this.debugFixtures()) {
					new FixtureDebuggingEntity()
						.mount(self)
						.depth(self.depth() + 1)
						.translateTo(fixture.shape.data.x, fixture.shape.data.y, 0)
						.width(fixture.shape.data.width * 2)
						.height(fixture.shape.data.height * 2)
						.streamMode(1);
				}
			}
		}

		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.4,
			angularDamping: 0.8,
			allowSleep: true,
			bullet: false,
			gravitic: false,
			fixedRotation: false,
			fixtures: this._fixtures
		});

		return this;
	},

	mountGrid: function() {
		var maxRowLength = this.maxRowLengthForGrid(this._grid);

		this.height(Block.prototype.HEIGHT * this._grid.length)
			.width(Block.prototype.WIDTH * maxRowLength);
		this._renderContainer.height(this.height())
			.width(this.width());

		for (var row = 0; row < this._grid.length; row++) {
			for (var col = 0; col < this._grid[row].length; col++) {
				var block = this._grid[row][col];

				if (block === undefined) {
					continue;
				}

				var x = Block.prototype.WIDTH * col - this._geometry.x2 + block._geometry.x2;
				var y = Block.prototype.HEIGHT * row - this._geometry.y2 + block._geometry.y2;

				block.translateTo(x, y, 0)
					.mount(this._renderContainer);
			}
		}
	},

	maxRowLengthForGrid: function(grid) {
		var maxRowLength = 0;
		for (var row = 0; row < grid.length; row++) {
			if (grid[row].length > maxRowLength) {
				maxRowLength = grid[row].length;
			}
		}

		return maxRowLength;
	},

	/**
	 * Call this before calling setGrid to create a bunch of entities which will help to visualize the box2D fixtures
	 * @param flag true iff you want to debug the fixtures
	 */
	debugFixtures: function(flag) {
		if (flag === undefined)
			return this._debugFixtures;

		this._debugFixtures = flag;

		return this;
	},

	update: function(ctx) {
		if (!ige.isServer) {
			// TODO: This is a fix for having the entity aabb's draw in the center initially rather than where
			// the entity has been initially translated to. Ideally, I should be able to call aabb(true) once
			// before the update loop even happens, but I had trouble finding the right place to do this and even
			// trying to trigger this code on just the first update didn't seem to work.
			this._renderContainer.aabb(true);
		}

		IgeEntityBox2d.prototype.update.call(this, ctx);
	},


	tick: function(ctx) {

		if (ige.isServer) {
			// Attract the block grid to another body. For example, small asteroids
			// are attracted to player ships.
			if (this.attractedTo !== undefined) {
				var attractedToBody = this.attractedTo._box2dBody;
				var thisBody = this._box2dBody;
				var impulse = new ige.box2d.b2Vec2(0, 0);
				impulse.Add(attractedToBody.GetWorldCenter());
				impulse.Subtract(thisBody.GetWorldCenter());
				impulse.Multiply(this.attractedTo.attractionStrength());
				thisBody.ApplyImpulse(impulse, thisBody.GetWorldCenter());
			}
		}

		return IgeEntityBox2d.prototype.tick.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
