var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	/** Contains the grid of Block objects that make up this BlockGrid */
	_grid: [],
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
			this._renderContainer = new RenderContainer()
				.mount(this)

			this.mountGrid();
			this.mouseDown(this.mouseDownHandler);
		}
	},

	addConstructionZonesAroundBlocks: function() {
		//First create an array that's two larger in each dimensions than the current grid
		oldNumRows = this.grid().length;
		oldNumCols = this.maxRowLengthForGrid(this.grid());

		newNumRows = oldNumRows + 2;
		newNumCols = oldNumCols + 2;

		var newGrid = this.newGridFromDimensions(newNumRows, newNumCols);

		//Copy the grid over to the new array with an offset of (1, 1)
		for (var row = 0; row < oldNumRows; row++) {
			for (var col = 0; col < oldNumCols; col++) {
				newGrid[row + 1][col + 1] = this.getBlockFromGrid(row, col);
			}
		}

		//Traverse the two dimensional array looking for spaces where the following two conditions hold: (1) the space is an undefined and (2) the space has at least one neighbor that's undefined
		this._grid = newGrid;
		for (var row = 0; row < newNumRows; row++) {
			for (var col = 0; col < newNumCols; col++) {
				if(this._grid[row][col] === undefined) {
					if (this.isRealBlock(row + 1, col) || this.isRealBlock(row - 1, col) || this.isRealBlock(row, col + 1) || this.isRealBlock(row, col - 1)) {
						this._grid[row][col] = new ConstructionZoneBlock();
					}
				}
			}
		}
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

		// This is the BlockGrid's rotation, not the render container's, since the render container does
		// not rotate with respect to its parent.
		// Negative because we want to reverse the rotation.
		var theta = -this._rotate.z;

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

		var block = this._grid[row][col];

		// Check if we have clicked on a valid block, if so we want to stop the
		// click propagation so we don't construct a block at this location
		if (block === undefined) {
			return;
		}
		else {
			control.stopPropagation();
		}

		// TODO: This might be dangerous, since some of the event properties should be changed so that they are
		// relative to the child's bounding box, but since we don't use any of those properties for the moment,
		// ignore that.
		if (this.getBlockFromBlockGrid(row+1, col) == undefined ||
			this.getBlockFromBlockGrid(row-1, col) == undefined ||
			this.getBlockFromBlockGrid(row, col+1) == undefined ||
			this.getBlockFromBlockGrid(row, col-1) == undefined) {
			block.mouseDown(event, control);
		}
	},

	getBlockFromBlockGrid: function(row, col) {
		// Check if row, col refers to a block that is off the edge of the block grid.
		if(row < 0 || col < 0) {
			return undefined;
		}
		if (row >= this.grid().length) {
			return undefined;
		}
		if (col >= this.grid()[row].length) {
			return undefined;
		}

		return this.grid()[row][col];
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

	POTENTIAL BUG: are numCols and numRows switched?
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

	// Created on server, streamed to all clients
	addMiningParticles: function(blockGridId, row, col) {
		var block = ige.$(blockGridId).grid()[row][col];
		// Calculate where to put our effect mount
		// with respect to the BlockGrid
		var x = Block.prototype.WIDTH * col -
						this._bounds2d.x2 + block._bounds2d.x2;
		var y = Block.prototype.HEIGHT * row -
						this._bounds2d.y2 + block._bounds2d.y2;

		// Store the effectsMount in the block so we can remove it later
		block.effectsMount = new EffectsMount()
			.mount(this)
			.streamMode(1)
			.translateBy(x, y, 0)

		block.blockParticleEmitter = new BlockParticleEmitter()
			.streamMode(1)
			.mount(block.effectsMount)

		return this;
	},

	/**
	 * Called every time a ship mines a block
	 */
	blockMinedListener: function (player, blockClassId, block) {
		block.blockParticleEmitter.destroy();
		block.effectsMount.destroy();
	},

	processBlockActionServer: function(data, player) {
		var self = this;
		var block = self._grid[data.row][data.col];
		if (block === undefined) {
			return false;
		}

		switch (data.action) {
			case 'remove':
				this.remove(data.row, data.col);
				return true;

			// TODO: Vary mining speed based on block material
			case 'mine':
				// Blocks should only be mined by one player, for now.
				if(block.busy()) {
					return false;
				}
				block.busy(true);

				setTimeout(function() {
					// Emit a message saying that a block has been mined, but not
					// necessarily collected. This is used for removing the laser.
					var blockClassId = block.classId();
					ige.emit('block mined', [player, blockClassId, block]);

					// Remove block server side, then send remove msg to client
					self.remove(data.row, data.col);
					data.action = 'remove';
					ige.network.send('blockAction', data);
				}, Block.prototype.MINING_TIME);

				return true;

			default:
				this.log('Cannot process block action ' + data.action + ' because no such action exists.', 'warning');
				return false;
		}
	},

	processBlockActionClient: function(data) {
		var self = this;

		switch (data.action) {
			case 'remove':
				this.remove(data.row, data.col);
				this._renderContainer.cacheDirty(true);
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
		if (block === undefined)
			return;

		if (ige.isServer) {
			this._box2dBody.DestroyFixture(block.fixture());

			// Calculate position of new BlockGrid, taking into account rotation
			var gridX = this.translate().x();
			var gridY = this.translate().y();
			var fixtureX = block.fixtureDef().shape.data.x;
			var fixtureY = block.fixtureDef().shape.data.y;
			var theta = this.rotate().z();

			var finalX = 	Math.cos(theta) * fixtureX -
										Math.sin(theta) * fixtureY + gridX;
			var finalY =	Math.sin(theta) * fixtureX +
										Math.cos(theta) * fixtureY + gridY;

			// Create new IgeEntityBox2d separate from parent
			var newGrid = new BlockGrid()
				.category('smallAsteroid')
				.mount(ige.server.spaceGameScene)
				.grid([[Block.prototype.blockFromClassId(block.classId())]])
				.translateTo(finalX, finalY, 0)
				.rotate().z(theta)
				.streamMode(1);

			// TODO: Compute correct velocities for new bodies, if needed
		}

		block.destroy();
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

		var maxRowLength = this.maxRowLengthForGrid(this._grid);

		this.height(Block.prototype.HEIGHT * this._grid.length);
		this.width(Block.prototype.WIDTH * maxRowLength);

		this.updateFixtures();

		this.addConstructionZonesAroundBlocks();

		return this;
	},

	/**
	 * Update fixtures should be called whenever _grid is changed in a way that would affect the physics of the blockgrid.
	 */
	updateFixtures: function() {
		this.box2dBody({
			type: 'dynamic',
			linearDamping: 0.4,
			angularDamping: 0.8,
			allowSleep: true,
			bullet: false,
			gravitic: false,
			fixedRotation: false,
		});

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

				var x = width * col - this._bounds2d.x2 + block._bounds2d.x2;
				var y = height * row - this._bounds2d.y2 + block._bounds2d.y2;

				var fixtureDef = {
					density: 1.0,
					friction: 0.5,
					restitution: 0.5,
					shape: {
						type: 'rectangle',
						data: {
							// The position of the fixture relative to the body
							x: x,
							y: y,
							width: width / 2,
							height: height / 2
						}
					}
				};
				var fixture = ige.box2d.addFixture(this._box2dBody, fixtureDef);
				// Add fixture reference to Block so we can destroy fixture later.
				block.fixture(fixture);
				// Add fixtureDef reference so we can create a new BlockGrid later.
				block.fixtureDef(fixtureDef);

				if (this.debugFixtures()) {
					new FixtureDebuggingEntity()
						.mount(this)
						.depth(this.depth() + 1)
						.translateTo(fixtureDef.shape.data.x, fixtureDef.shape.data.y, 0)
						.width(fixtureDef.shape.data.width * 2)
						.height(fixtureDef.shape.data.height * 2)
						.streamMode(1);
				}
			}
		}

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

				var x = Block.prototype.WIDTH * col - this._bounds2d.x2 + block._bounds2d.x2;
				var y = Block.prototype.HEIGHT * row - this._bounds2d.y2 + block._bounds2d.y2;

				block.translateTo(x, y, 0)
					.mount(this._renderContainer);
			}
		}
	},

	/**
	 * getBlockFromGrid returns the block in this block grid at row, col, but will return undefined if row, col is not a valid index into the grid.
	 * Basically it's a safe (but slightly slower) way of indexing into the grid.
	 */
	getBlockFromGrid: function(row, col) {
		// Check if row, col refers to a block that is off the edge of the block grid.
		if(row < 0 || col < 0) {
			return undefined;
		}
		if (row >= this.grid().length) {
			return undefined;
		}
		if (col >= this.grid()[row].length) {
			return undefined;
		}

		return this.grid()[row][col];
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

	isRealBlock: function(row, col) {
		var block = this.getBlockFromGrid(row, col);

		if (block === undefined) {
			return false;
		}

		if (block.classId() === "ConstructionZoneBlock") {
			return false;
		}

		return true;
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

		IgeEntityBox2d.prototype.update.call(this, ctx);
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
