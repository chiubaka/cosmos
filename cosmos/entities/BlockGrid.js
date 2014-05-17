var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	/** Contains the grid of Block objects that make up this BlockGrid */
	_grid: undefined,
	/** The rendering container for this BlockGrid, which essentially provides a cacheable location for the BlockGrid's
	 * texture. */
	_renderContainer: undefined,
	_constructionZoneOverlay: undefined,
	_debugFixtures: false,
	// Default 10 padding on all sides
	_padding: 10,

	init: function(data) {
		var self = this;

		IgeEntityBox2d.prototype.init.call(this);

		if (!ige.isServer) {
			this.gridFromStreamCreateData(data);
			this._renderContainer = new RenderContainer()
				.mount(this);

			// TODO: Lazily create when needed to speed up load time.
			this._constructionZoneOverlay = new ConstructionZoneOverlay(this._grid)
				.mount(this);

			this.mountGrid();
			this.mouseDown(this.mouseDownHandler);
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
		if (this._grid.get2D(row+1, col) == undefined ||
			this._grid.get2D(row-1, col) == undefined ||
			this._grid.get2D(row, col+1) == undefined ||
			this._grid.get2D(row, col-1) == undefined) {
			block.mouseDown(event, control);
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
		var rxGrid = data;
		
		this._grid = [];
		for (var i = 0; i < rxGrid.length; i++) {
			var row = [];
			for (var j = 0; j < rxGrid[i].length; j++) {
				var classId = rxGrid[i][j];

				var block = Block.prototype.blockFromClassId(classId);

				if (block !== undefined) {
					block.row(i).col(j);
				}

				row.push(block);
			}
			this._grid.push(row);
		}
	},

	// TODO: Use non padded method
	padding: function(val) {
		this._padding = val;
		return this;
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

		switch (data.action) {
			case 'remove':
				this.remove(data.row, data.col);
				return true;

			// TODO: Vary mining speed based on block material
			case 'mine':
				var block = self._grid.get2D(data.row, data.col);
				if (block === undefined) {
					return false;
				}
				// Blocks should only be mined by one player, for now.
				if((block === undefined) || block.busy()) {
					return false;
				}
				block.busy(true);

				block._decrementHealthIntervalId = setInterval(function() {
					if (block._hp > 0) {
						var damageData = {
							blockGridId: data.blockGridId,
							action: 'damage',
							row: data.row,
							col: data.col,
							amount: 1
						};
						block.damage(1);
						ige.network.send('blockAction', damageData);
					}

					if (block._hp == 0) {
						clearInterval(block._decrementHealthIntervalId);

						// Emit a message saying that a block has been mined, but not
						// necessarily collected. This is used for removing the laser.
						var blockClassId = block.classId();
						ige.emit('block mined', [player, blockClassId, block]);

						// Remove block server side, then send remove msg to client
						self.remove(data.row, data.col);
						data.action = 'remove';
						ige.network.send('blockAction', data);
					}
				}, Block.prototype.MINING_TIME / block._maxHp);
				return true;

			case 'add':
				// Add block server side, then send add msg to client
				if(!self.add(data.row, data.col, data.selectedType)) {
					return false;
				}
				else {
					data.action = 'add';
					ige.network.send('blockAction', data);
					return true;
				}

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
				this._renderContainer.refresh();
				this._constructionZoneOverlay.refreshNeeded(true);
				break;
			case 'damage':
				var block = this._grid.get2D(data.row, data.col);
				block.damage(data.amount);
				break;
			case 'add':
				ige.client.metrics.fireEvent('construct', 'existing', data.selectedType);
				this.add(data.row, data.col, data.selectedType);
				this._renderContainer.refresh();
				this._constructionZoneOverlay.refreshNeeded(true);
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
		// TODO: Split BlockGrids and make 1x1 asteroids smallAsteroids so
		// they get attracted
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

	add: function(row, col, blockClassId) {
		// TODO: Handle expanding the BlockGrid
		if (!this._grid.is2DInBounds(row, col)) {
			return false;
		}

		// Make sure we don't attract formely small asteroids
		if (this.category() === 'smallAsteroid') {
			// Don't use getter/setter because undefined gets value
			this._category = undefined;
		}

		var block = Block.prototype.blockFromClassId(blockClassId)
			.row(row)
			.col(col);

		this._grid[row][col] = block;

		// Update client's scenegraph
		if (!ige.isServer) {
			this._renderContainer.height(this.height());
			this._renderContainer.width(this.width());

			var x = Block.prototype.WIDTH * col - this._bounds2d.x2 + block._bounds2d.x2;
			var y = Block.prototype.HEIGHT * row - this._bounds2d.y2 + block._bounds2d.y2;

			block.translateTo(x, y, 0)
				.mount(this._renderContainer);
		}

		// Update server's physics model
		if (ige.isServer) {
			this.addFixture(this._box2dBody, block, row, col);
		}

		return true

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

		// TODO: Get rid of padding and use expanding BlockGrids
		this._grid = BlockGridPadding.padGrid(grid, this._padding);
		var maxRowLength = this._grid.get2DMaxRowLength();

		this.height(Block.prototype.HEIGHT * this._grid.length);
		this.width(Block.prototype.WIDTH * maxRowLength);

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

				this.addFixture(this._box2dBody, block, row, col);

			}
		}

		return this;
	},

	addFixture: function (box2dBody, block, row, col) {
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

		var fixture = ige.box2d.addFixture(box2dBody, fixtureDef);
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
	},

	mountGrid: function() {
		var maxRowLength = this._grid.get2DMaxRowLength();

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

		this._renderContainer.refresh();
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

	/**
	 * Is update called once per time-step per viewport, or just once per time-step?
	*/
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


			//This is just a little bit larger than the background image. That's why I chose this size.
			var MAX_X = 7000;
			var MAX_Y = 7000;
			var x = this.translate().x();
			var y = this.translate().y();

			if (x > MAX_X || x < -MAX_X) {
				this.translateTo(-x, y, 0);
			}
			if (y > MAX_Y || y < -MAX_Y) {
				this.translateTo(x, -y, 0);
			}
		}

		IgeEntityBox2d.prototype.update.call(this, ctx);
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
