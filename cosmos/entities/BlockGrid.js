var BlockGrid = IgeEntityBox2d.extend({
	classId: "BlockGrid",

	// #ifdef SERVER
	_physicsContainer: undefined,
	_physicsOffset: undefined,

	/**
	 * A hash whose keys are clientIds and values are Booleans.
	 * This is used in _streamControlFunc to determine if this entity has been
	 * streamed to a particular client. If an entity is not visible and has
	 * previously been streamed, then we know to send an _entityInvalid command
	 * to the client.
	 * @type {Object}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_previouslyStreamed: undefined,
	// #else
	/**
	 * Container for effects that need to appear above this BlockGrid.
	 */
	_effectsAboveContainer: undefined,
	/**
	 * Container for effects that need to appear below this BlockGrid.
	 */
	_effectsBelowContainer: undefined,
	/**
	 * Container for rendering child entities (i.e. Blocks).
	 */
	_renderContainer: undefined,
	// #endif

	init: function(data) {
		IgeEntityBox2d.prototype.init.call(this, data);

		this.implement(SparseGrid);
		SparseGrid.prototype.init.call(this, data);
		//this._grid = new SparseGrid();

		this.width(0);
		this.height(0);

		this.addComponent(PixiRenderableComponent);

		// #ifdef CLIENT
		if (ige.isClient) {
			// All containers have height and width 0, since their heights and widths do not need
			// to be kept up to date. Keeping the height and width 0 makes things slightly easier
			// to reason about because translating a container now feels more like translating a
			// point.
			this._effectsAboveContainer = new IgeEntity()
				.addComponent(PixiRenderableComponent)
				.depth(this.depth() + 1)
				.width(0)
				.height(0)
				.mount(this);

			this._effectsBelowContainer = new IgeEntity()
				.addComponent(PixiRenderableComponent)
				.depth(this.depth() - 1)
				.width(0)
				.height(0)
				.mount(this);

			// Create the render container and mount it to this entity.
			this._renderContainer = new RenderContainer()
				.depth(this.depth())
				.width(0)
				.height(0)
				.mount(this);

			if (data !== undefined) {
				// Hydrate this BlockGrid from JSON sent from the server.
				this.fromJSON(Block, data);
			}

			this.mouseDown(this._mouseDownHandler);
		}
		// #else
		else {
			this.box2dBody({
				type: 'dynamic',
				linearDamping: 0.4,
				angularDamping: 1.5,
				allowSleep: true,
				bullet: false,
				gravitic: false,
				fixedRotation: false
			});

			// Used by streamControlFunc to help determine when to stream this entity to a client.
			this._previouslyStreamed = {};
			this.streamControl(this._streamControlFunc.bind(this))
		}
		// #endif
	},

	// #ifdef CLIENT
	/**
	 * Adds an effect to a {@link Block} in this {@link BlockGrid}
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the mining laser.
	 * @memberof BlockGrid
	 * @instance
	 */
	addEffect: function(effect) {
		var block = this.get(new IgePoint2d(effect.sourceBlock.col, effect.sourceBlock.row))[0];
		block.addEffect(effect);
	},
	// #endif

	// #ifdef SERVER
	/**
	 * Removes a block or area of blocks from a BlockGrid and places it in a new drop at its current
	 * location.
	 * @param player The player who owns this drop. Undefined here means that anyone can pick up
	 * the drop.
	 * @param loc The location in the grid that should be dropped.
	 * @param width The width of the area that should be dropped. Defaults to 1 if no value is
	 * provided.
	 * @param height The height of the area that should be dropped. Defaults to 1 if no value is
	 * provided.
	 * @returns {null}
	 */
	drop: function(player, loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("BlockGrid#drop: invalid location parameter.", "warning");
			return null;
		}

		width = width || 1;
		height = height || 1;

		var owner = (player !== undefined) ? player.currentShip() : undefined;
		var theta = this.rotate().z();
		var dropped = this.remove(loc, width, height);

		var self = this;
		_.forEach(dropped, function(drop) {
			// Don't drop control blocks!
			if (drop instanceof ControlBlock) {
				return;
			}

			var dropCoordinates = self.worldCoordinatesForBlock(drop);
			var newDrop = new Drop()
				.block(drop)
				.owner(owner)
				.translateTo(dropCoordinates.x, dropCoordinates.y, 0)
				.rotateTo(0, 0, theta)
				.streamMode(1)
				.mount(ige.server.spaceGameScene);
		});
	},
	// #endif

	// #ifdef CLIENT
	effectsAboveContainer: function() {
		return this._effectsAboveContainer;
	},
	// #endif

	// #ifdef CLIENT
	effectsBelowContainer: function() {
		return this._effectsBelowContainer;
	},
	// #endif

	/**
	 * DON'T USE THIS FOR ANYTHING WHERE PERFORMANCE IS CRITICAL.
	 * Resets this BlockGrid's internal state to represent the grid that is represented by the provided {@link Block}
	 * matrix, which is a matrix of {@link Block}s. undefined is used to indicate that a space in the matrix is empty.
	 * @param blockMatrix {Array} An array of arrays that holds {@link Block objects}. undefined is used to indicate
	 * that a space in the blockMatrix is empty. The blockMatrix must be a rectangular matrix (every row has the same
	 * number of columns and every column has the same number of rows, but the total number of rows and total number
	 * of columns is not required to be the same).
	 * @param checkForNeighbors {boolean} Whether or not we should validate that each {@link Block} will be
	 * attached to the existing structure in this {@link BlockGrid}. Default behavior is to check for neighbors.
	 * @return {BlockGrid} Return this object to make function chaining convenient.
	 * @memberof BlockGrid
	 * @instance
	 */
	fromBlockMatrix: function(blockMatrix, checkForNeighbors) {
		for (var row = 0; row < blockMatrix.length; row++) {
			for (var col = 0; col < blockMatrix[row].length; col++) {
				if (blockMatrix[row][col]) {
					this.put(blockMatrix[row][col], new IgePoint2d(col, row), false);
				}
			}
		}

		return this;
	},

	/**
	 * DON'T USE THIS FOR ANYTHING WHERE PERFORMANCE IS CRITICAL.
	 * Resets this BlockGrid's internal state to represent the grid that is represented by the provided block type
	 * matrix, which is a matrix of class ID's where each class ID represents a block type in the grid.
	 * This is used for de-serializing a BlockGrid object.
	 * @param blockTypeMatrix {Array} An array of arrays that holds classId's for Block objects. undefined is used to
	 * indicate that a space in the blockTypeMatrix does not include a Block. The blockTypeMatrix must be a rectangular
	 * matrix (every row has the same number of columns and every column has the same number of rows, but the total number
	 * of rows and total number of columns is not required to be the same).
	 * @param checkForNeighbors {boolean} Whether or not we should validate that each {@link Block} will be
	 * attached to the existing structure in this {@link BlockGrid}. Default behavior is to check for neighbors.
	 * @returns {BlockGrid} Return this object to make function chaining convenient.
	 * @memberof BlockGrid
	 * @instance
	 */
	fromBlockTypeMatrix: function(blockTypeMatrix, checkForNeighbors, startRow, startCol) {
		startRow = startRow || 0;
		startCol = startCol || 0;

		for (var row = 0; row < blockTypeMatrix.length; row++) {
			for (var col = 0; col < blockTypeMatrix[row].length; col++) {
				if (blockTypeMatrix[row][col]) {
					// The add() function knows how to deal with receiving undefined
					this.put(
						Block.blockFromClassId(blockTypeMatrix[row][col]),
						new IgePoint2d(startCol + cow, startRol + row),
						false
					);
				}
			}
		}

		return this;
	},

	/**
	 * Process actions on {@link Block}s client-side.
	 * @param data {Object} An object representing the action sent from the server.
	 * @memberof BlockGrid
	 * @instance
	 */
	processBlockActionClient: function(data) {
		switch (data.action) {
			case 'remove':
				this.remove(new IgePoint2d(data.col, data.row));
				if (this.count() === 0) {
					this.destroy();
				}
				break;
			case 'damage':
				var block = this.get(new IgePoint2d(data.col, data.row))[0];
				block.takeDamage(data.amount);
				break;
			case 'add':
				ige.client.metrics.track(
					'cosmos:construct.existing',
					{'type': data.selectedType});
				this.put(Block.blockFromClassId(data.selectedType), new IgePoint2d(data.col, data.row), true);
				ige.emit('cosmos:BlockGrid.processBlockActionClient.add', [data.selectedType, this]);
				break;
			default:
				this.log('Cannot process block action ' + data.action + ' because no such action exists.', 'warning');
		}
	},

	/**
	 * Process actions on {@link Block}s server-side.
	 * @param data {Object} An object representing the action sent from the client.
	 * @param player {Player} The player that triggered the block action.
	 * @returns {boolean} True if the action was successfully processed. False otherwise.
	 * @memberof BlockGrid
	 * @instance
	 */
	processBlockActionServer: function(data, player) {
		var self = this;

		switch (data.action) {
			case 'remove':
				this.remove(new IgePoint2d(data.col, data.row));
				if (this.count() === 0) {
					this.destroy();
				}
				return true;
			case 'add':
				var location = new IgePoint2d(data.col, data.row);

				// Blocks added as the result of a query from a client must be added to an existing
				// contiguous structure.
				if (this.hasNeighbors(location)) {
					self.put(Block.blockFromClassId(data.selectedType), new IgePoint2d(data.col, data.row), false);
					data.action = 'add';
					ige.network.send('blockAction', data);
					return true;
				}
				else {
					return false;
				}
			default:
				return false;
		}
	},

	/**
	 * Places a block in the BlockGrid at the specified location.
	 * @param block The block to place.
	 * @param location The location to place the block at.
	 * @param replace If true, then the BlockGrid will replace any existing Blocks. If false, the
	 * BlockGrid will not replace existing blocks.
	 * @returns {*} A list of blocks that were replaced if replacement is on. An empty list if
	 * replacement is not. Returns null in the event of an error.
	 */
	put: function(block, location, replace) {
		// Validate parameters
		if (!block) {
			this.log("Invalid block passed to BlockGrid#put.", "warning");
			return null;
		}

		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGrid#put.", "warning");
			return null;
		}

		var previousBlocks = SparseGrid.prototype.put.call(this, block, location, replace);

		// If previous blocks was null, then this block was placed on top of another block without
		// replacement.
		if (previousBlocks === null) {
			return null;
		}

		this.width(this.gridWidth() * Block.WIDTH);
		this.height(this.gridHeight() * Block.HEIGHT);

		// #ifdef SERVER
		if (ige.isServer) {
			this._addFixture(block);
		}
		// #else
		else {
			this._mountToRenderContainer(block);
		}
		// #endif

		this._translateContainers();

		return previousBlocks;
	},

	/**
	 * Removes the object the specified location or the objects in the specified area.
	 * @param location The top left corner of the area to remove blocks from.
	 * @param width The width of the area to remove from. Defaults to 1 if no parameter is passed.
	 * @param height The height of the area to remove from. Defaults to 1 if no parameter is passed.
	 * @returns {*} A list of the blocks that were removed. May return null to indicate an error
	 * has occurred.
	 */
	remove: function(location, width, height) {
		// Validate parameters
		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGrid#remove.", "warning");
			return null;
		}

		var removedBlocks = SparseGrid.prototype.remove.call(this, location, width, height);

		this.width(this.gridWidth() * Block.WIDTH);
		this.height(this.gridHeight() * Block.HEIGHT);

		this._translateContainers();

		var self = this;
		_.forEach(removedBlocks, function(block) {
			// #ifdef SERVER
			if (ige.isServer) {
				self._box2dBody.DestroyFixture(block.fixture());
			}
			// #else
			else {
				block.unMount();
			}
			// #endif
			block.onRemoved();
		});

		return removedBlocks;
	},

	/**
	 * Removes an effect from a {@link Block} in this {@link BlockGrid}
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the mining laser.
	 * @memberof BlockGrid
	 * @instance
	 */
	removeEffect: function(effect) {
		var block = this.get(new IgePoint2d(effect.sourceBlock.col, effect.sourceBlock.row))[0];

		block.removeEffect(effect);
	},

	streamCreateData: function() {
		return this.toJSON();
	},

	/**
	 * Overrides the IgeEntityBox2d default streamSectionData function. This has been done to
	 * provide support for streaming a custom point and have the client interpolate that point.
	 * @param sectionId
	 * @param data
	 * @param bypassTimeStream
	 * @returns {string}
	 */
	streamSectionData: function(sectionId, data, bypassTimeStream) {
		switch (sectionId) {
			case 'transform':
				// If data has been provided, then we are on the client and need to handle values
				// passed to us by the server. In this case, the IgeEntityBox2d already knows what
				// to do and does some complex things to make interpolation work. Don't want to get
				// into that, so just let it do the work.
				if (data) {
					IgeEntityBox2d.prototype.streamSectionData
						.call(this, sectionId, data, bypassTimeStream);
				}
				// Otherwise, we are on the server and are being asked to produce values to pass
				// to the client. We want to send the physics position of this entity to the client.
				// That way the client can independently compute where things should go. This was
				// necessary to solve a problem where stream data from the server with old values
				// would render any attempt to translate the entity on the client completely
				// useless.
				else {
					var translate = new IgePoint3d(
						this._box2dBody.m_xf.position.x * this._b2dRef._scaleRatio,
						this._box2dBody.m_xf.position.y * this._b2dRef._scaleRatio,
						this._translate.z
					);

					return translate.toString(this._streamFloatPrecision) + ',' +
						this._scale.toString(this._streamFloatPrecision) + ',' +
						this._rotate.toString(this._streamFloatPrecision) + ',';
				}
				break;
			// We don't care about any other stream sections.
			default:
				IgeEntityBox2d.prototype.streamSectionData
					.call(this, sectionId, data, bypassTimeStream);
				break;
		}
	},

	worldCoordinatesForBlock: function(block) {
		var theta = this.rotate().z();

		var entityCenter = {
			x: this.translate().x(),
			y: this.translate().y()
		};

		var relBlockLoc = {
			x: block.gridData.loc.x - this.lowerBound().x,
			y: block.gridData.loc.y - this.lowerBound().y
		};

		var localCoordinates = {
			x: -(this._bounds2d.x2 - relBlockLoc.x * Block.WIDTH)
				+ block._bounds2d.x2,
			y: -(this._bounds2d.y2 - relBlockLoc.y * Block.HEIGHT)
				+ block._bounds2d.y2
		};

		var rotatedLocalCoordinates = MathUtils.rotate(localCoordinates, theta);

		return new IgePoint2d(
			rotatedLocalCoordinates.x + entityCenter.x,
			rotatedLocalCoordinates.y + entityCenter.y
		);
	},

	_addFixture: function(block) {
		// #ifdef SERVER
		if (ige.isServer) {
			var fixtureDef = this._createFixtureDef(block);

			block.fixtureDef(fixtureDef);

			if (block.fixture() !== undefined) {
				this._box2dBody.DestroyFixture(block.fixture());
			}

			// Add a new fixture based on the new fixture def.
			block.fixture(ige.box2d.addFixture(this._box2dBody, fixtureDef));
		}
		// #endif
	},

	/**
	 * Given a mouse click, determines what location in the grid has been pressed in grid-relative
	 * coordinates.
	 * Does this by:
	 * 1. Unrotating the click coordinate
	 * 2. Comparing the unrotated click coordinate to where the blocks would be if the BlockGrid were not rotated
	 * @param event {Object} The event data for the click event.
	 * @param control {Object} The control data for the click event.
	 * @returns {IgePoint2d} The location that was clicked.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	locationForClick: function(event, control) {
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
		var unrotated = MathUtils.rotate(new IgePoint2d(aabbRelativeX, aabbRelativeY), theta);

		// Height and width of the grid area //TODO refactor all of these operations to be vector operations
		var width = this.width();
		var height = this.height();

		// Coordinates for the top left corner of the grid area
		var topLeftCornerX = -width / 2;
		var topLeftCornerY = -height / 2;

		// Coordinates of the unrotated clicked point with respect to the top left of the grid area
		// This is just so calculations are a little bit easier
		var gridX = unrotated.x - topLeftCornerX;
		var gridY = unrotated.y - topLeftCornerY;

		var x = Math.floor(gridX / Block.WIDTH) + this.lowerBound().x;
		var y = Math.floor(gridY / Block.HEIGHT) + this.lowerBound().y;

		return new IgePoint2d(x, y);
	},

	_blockForClick: function(event, control) {
		var location = this.locationForClick(event, control);

		return this.get(location)[0];
	},

	_createFixtureDef: function(block) {
		var coordinates = BlockGrid.coordinatesForBlock(block);
		var width = block.width();
		var height = block.height();
		return {
			density: BlockGrid.BLOCK_FIXTURE_DENSITY,
			friction: BlockGrid.BLOCK_FIXTURE_FRICTION,
			restitution: BlockGrid.BLOCK_FIXTURE_RESTITUTION,
			shape: {
				type: 'rectangle',
				data: {
					x: coordinates.x,
					y: coordinates.y,
					width: width / 2 - BlockGrid.BLOCK_FIXTURE_PADDING,
					height: height / 2 - BlockGrid.BLOCK_FIXTURE_PADDING
				}
			}
		}
	},

	_mountToRenderContainer: function(block) {
		var coordinates = BlockGrid.coordinatesForBlock(block);
		// Attach the block to the render container.
		block.mount(this._renderContainer);
		// Move the block within the render container to the right location.
		block.translateTo(coordinates.x, coordinates.y, 0);
	},

	/**
	 * Determines which {@link Block} in the {@link BlockGrid} was clicked and then passes the clicked {@link Block} to
	 * the {@link BlockGrid#_blockClickHandler}, which can be overriden by subclasses.
	 * @param event {Object} Information about the event that was fired.
	 * @param control {Object} Information about the control that was used when the event was fired. (Not really sure
	 * what this is.)
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_mouseDownHandler: function(event, control) {
		var block = this._blockForClick(event, control);

		// Check if we have clicked on a valid block, if so we want to stop the
		// click propagation so we don't construct a block at this location
		if (block === undefined) {
			return;
		}
		else {
			control.stopPropagation();
		}

		ige.emit('cosmos:block.mousedown', block);
		this._blockClickHandler(block, event, control);
	},

	/**
	 * Overrides superclass function. This function makes it possible for the client to mirror the
	 * calculations done on the server so that the two stay in sync all the time and no jumping
	 * occurs.
	 * @param dataArr
	 * @private
	 */
	_setTransformFromStreamData: function(dataArr) {
		// This will set our location to the physics location that is being streamed.
		IgeEntityBox2d.prototype._setTransformFromStreamData.call(this, dataArr);

		var rotatedPhysicsOffset = MathUtils.rotate(this._physicsOffset, this.rotate().z());

		// This will translate the entity to the computed physics offset on the client.
		this.translateBy(rotatedPhysicsOffset.x, rotatedPhysicsOffset.y, 0);
	},

	// #ifdef SERVER
	/**
	 * Controls whether or not this entity is streamed to a particular client.
	 * @param clientId {String} The client in question.
	 * @return {Boolean} True if the entity should be streamed to the client
	 * associated with the clientId.
	 * {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_streamControlFunc: function(clientId) {
		var player = ige.server.players[clientId];

		// TODO: Make a proper entity preloader to stop jittering when BlockGrids
		// are created on screen
		if (player === undefined || player.currentShip() === undefined) {
			this._previouslyStreamed[clientId] = false;
			return false;
		}

		// Checks if the entity is visible to the player. This means that the
		// player's visible rectangle intersects with this entity's aabb rectangle.
		var playerWorldPosition = player.currentShip().worldPosition();
		var width = Constants.minimapArea.MAXIMUM_WIDTH;
		var height = Constants.minimapArea.MAXIMUM_HEIGHT;
		var viewableRect = new IgeRect(
				playerWorldPosition.x - width / 2,
				playerWorldPosition.y - height / 2,
			width,
			height);
		if (viewableRect.intersects(this.aabb())) {
			this._previouslyStreamed[clientId] = true;
			return true;
		}
		else {
			if (this._previouslyStreamed[clientId] === true) {
				this._previouslyStreamed[clientId] = false;
				// Invalidate the stream data for this entity. The server has an
				// optimization where it doesn't send a streamData update to the client
				// if the previous streamData is the same. This is problematic because
				// when this entity is in view again, we want the server to send an
				// streamData update to the client.
				// We can force the server to update by invalidating the cached
				// streamData.
				ige.network.stream._streamClientData[this.id()][clientId] = 'INVALID';
				ige.network.stream.queueCommand('_entityInvalid', this.id(), clientId);
			}
			return false;
		}
	},
	// #endif

	/**
	 * When a BlockGrid's bounds grow or shrink, we must translate the containers inside of it and
	 * the physics offset so that things look like they didn't move to users. This is because height
	 * and width changes to an entity increase the bounds of the entity on all sides, and those
	 * bounds must be accurate and tight in order to efficiently capture mouse clicks.
	 * @private
	 */
	_translateContainers: function() {
		var topLeftCoordinates = BlockGrid.coordinatesForLocation(this.lowerBound());
		this._oldGridCenter = this._gridCenter;

		// This is the center of the tight bounding box around the blocks in the grid in a
		// coordinate system where (0, 0) is the origin. For convenience, blocks are placed where
		// you would expect them to be based on their coordinates, and then the entire coordinate
		// frame is shifted to match where the BlockGrid is located.
		this._gridCenter = {
			x: topLeftCoordinates.x - Block.WIDTH / 2 + (this.gridWidth() * Block.WIDTH) / 2,
			y: topLeftCoordinates.y - Block.HEIGHT / 2 + (this.gridHeight() * Block.HEIGHT) / 2
		};

		// Do nothing if nothing has changed.
		if (this._oldGridCenter && this._oldGridCenter.x === this._gridCenter.x
			&& this._oldGridCenter.y === this._gridCenter.y) {
			return;
		}

		this._physicsOffset = this._gridCenter;

		// #ifdef SERVER
		if (ige.isServer) {
			if (this._oldGridCenter) {
				var physicsTranslation = {
					x: this._gridCenter.x - this._oldGridCenter.x,
					y: this._gridCenter.y - this._oldGridCenter.y
				};

				var theta = this.rotate().z();

				var rotatedEntityTranslation = MathUtils.rotate(physicsTranslation, theta);

				this.translate().x(this.translate().x() + rotatedEntityTranslation.x);
				this.translate().y(this.translate().y() + rotatedEntityTranslation.y);

				this._box2dBody.SetAwake(true);
			}
		}
		// #else
		else {
			this._effectsAboveContainer.translateTo(-this._gridCenter.x, -this._gridCenter.y, 0);
			this._effectsBelowContainer.translateTo(-this._gridCenter.x, -this._gridCenter.y, 0);
			this._renderContainer.translateTo(-this._gridCenter.x, -this._gridCenter.y, 0);

			if (this._oldGridCenter) {
				var renderTranslation = {
					x: -this._gridCenter.x - (-this._oldGridCenter.x),
					y: -this._gridCenter.y - (-this._oldGridCenter.y)
				};

				var entityTranslation = {
					x: -renderTranslation.x,
					y: -renderTranslation.y
				};

				var theta = this.rotate().z();

				var rotatedEntityTranslation = MathUtils.rotate(entityTranslation, theta);

				this.translateBy(rotatedEntityTranslation.x, rotatedEntityTranslation.y, 0);
			}
		}
		// #endif
	}
});

/**
 * The default density value of a fixture created for a {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_DENSITY = 1.0;
/**
 * The default friction value of a fixture created for a {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_FRICTION = 0.5;
/**
 * The default restitution value of a fixture created for a {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_RESTITUTION = 0.5;
/**
 * The default padding value of a fixture create for a {@link Block}. Padding defines the difference in space between
 * the rendered {@link Block} and the fixture for that {@link Block}.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.BLOCK_FIXTURE_PADDING = .1;

BlockGrid.coordinatesForBlock = function(block) {
	var loc = block.gridData.loc;

	var coordinates = BlockGrid.coordinatesForLocation(loc);

	// Because we need to return the center of the block. For larger blocks, this requires
	// adding as many half blocks as one minus the width of the block.
	coordinates.x += (block.gridData.width - 1) * Block.WIDTH / 2;
	// Because we need to return the center of the block. For larger blocks, this requires
	// adding as many half blocks as one minus the height of the block.
	coordinates.y += (block.gridData.height - 1) * Block.HEIGHT / 2;

	return coordinates;
};

BlockGrid.coordinatesForLocation = function(loc) {
	return {
		// Translates to the horizontal center of the location.
		x: Block.WIDTH * loc.x,
		// Translates to the vertical center of the location.
		y: Block.HEIGHT * loc.y
	}
};

if (typeof(module) !== "undefined" && typeof(module.exports) !== "undefined") {
	module.exports = BlockGrid;
}
