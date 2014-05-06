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
							.compositeCache(true)
							.mount(this)
							.blockGrid(this);

			this.updateCount = 0;
			// Add some randomness to spread out expensive aabb calls over time.
			// This leads to decreased stuttering.
			this.updateTrigger = RandomInterval.randomIntFromInterval(70, 120);

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

		this.height(Block.prototype.HEIGHT * this._grid.length)
			.width(Block.prototype.WIDTH * maxRowLength);

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
		else {
			// TODO: This is a fix for having the entity aabb's draw in the center initially rather than where
			// the entity has been initially translated to. Ideally, I should be able to call aabb(true) once
			// before the update loop even happens, but I had trouble finding the right place to do this and even
			// trying to trigger this code on just the first update didn't seem to work.
			this.updateCount++;
			if ((this.updateCount < 10) ||
				 ((this.updateCount % this.updateTrigger == 0))) {
				this._renderContainer.aabb(true);
			}
		}
		IgeEntityBox2d.prototype.update.call(this, ctx);
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
