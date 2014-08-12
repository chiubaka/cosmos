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
	_effectsAboveContainer: undefined,
	_effectsBelowContainer: undefined,
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
	drop: function(player, loc, width, height) {
		if (!IgePoint2d.validatePoint(loc)) {
			this.log("BlockGrid#drop: invalid location parameter.", "warning");
			return null;
		}

		width = width || 1;
		height = height || 1;

		var owner = (player !== undefined) ? player.currentShip() : undefined;
		var theta = -this.rotate().z();
		var dropped = this.remove(loc, width, height);

		this.log("BlockGrid#drop: " + dropped.length + " drops.");
		var self = this;
		_.forEach(dropped, function(drop) {
			console.log(drop.classId());
			var dropCoordinates = self.worldCoordinatesForBlock(drop);
			var newDrop = new Drop()
				.block(drop)
				.owner(owner)
				.translateTo(dropCoordinates.x, dropCoordinates.y, 0)
				.rotateTo(0, 0, theta)
				.streamMode(1)
				.mount(ige.server.spaceGameScene);

			self.log("BlockGrid#drop: dropping " + newDrop.id() +": " + newDrop.block().classId());
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
				this._renderContainer.refresh();
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
				this._renderContainer.refresh();
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
				this.remove(data.row, data.col);
				return true;

			// TODO: Vary mining speed based on block material
			case 'add':
				// Add block server side, then send add msg to client
				if(!self.add(data.row, data.col, Block.blockFromClassId(data.selectedType))) {
					return false;
				}
				else {
					data.action = 'add';
					ige.network.send('blockAction', data);
					return true;
				}
			default:
				return false;
		}
	},

	put: function(block, location, replace) {
		// Validate parameters
		if (!block) {
			this.log("Invalid block passed to BlockGrid#put.", "warning");
			return;
		}

		if (!IgePoint2d.validatePoint(location)) {
			this.log("Invalid location passed to BlockGrid#put.", "warning");
			return;
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

		return {
			x: rotatedLocalCoordinates.x + entityCenter.x,
			y: rotatedLocalCoordinates.y + entityCenter.y
		};
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
	 * Given a click event, locates the {@link Block} in this {@link BlockGrid} that was clicked by:
	 * 1. Unrotating the click coordinate
	 * 2. Comparing the unrotated click coordinate to where the blocks would be if the BlockGrid were not rotated
	 * @param event {Object} The event data for the click event.
	 * @param control {Object} The control data for the click event.
	 * @returns {Block|undefined} The {@link Block} that was clicked or undefined if no {@link Block} exists at the
	 * clicked location.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_blockForClick: function(event, control) {
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
		unrotated = MathUtils.rotate(new IgePoint2d(aabbRelativeX, aabbRelativeY), theta);

		// Height and width of the grid area
		var width = this.width();
		var height = this.height();

		// Check if the click was out of the grid area (happens because axis-aligned bounding boxes are larger
		// than the non-axis-aligned grid area)
		if (Math.abs(unrotated.x) > width / 2
			|| Math.abs(unrotated.y) > height / 2) {
			return;
		}

		// Coordinates for the top left corner of the grid area
		var topLeftCornerX = -width / 2;
		var topLeftCornerY = -height / 2;

		// Coordinates of the unrotated clicked point with respect to the top left of the grid area
		// This is just so calculations are a little bit easier
		var gridX = unrotated.x - topLeftCornerX;
		var gridY = unrotated.y - topLeftCornerY;

		var x = Math.floor(gridX / Block.WIDTH) + this.lowerBound().x;
		var y = Math.floor(gridY / Block.HEIGHT) + this.lowerBound().y;

		return this.get(new IgePoint2d(x, y))[0];
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

		// TODO: Make createConstructionZone and fromBlockTypeMatrix faster.
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

	_translateContainers: function() {
		var topLeftCoordinates = BlockGrid.coordinatesForLocation(this.lowerBound());
		this._oldGridCenter = this._gridCenter;
		this._gridCenter = {
			x: topLeftCoordinates.x - Block.WIDTH / 2 + (this.gridWidth() * Block.WIDTH) / 2,
			y: topLeftCoordinates.y - Block.HEIGHT / 2 + (this.gridHeight() * Block.HEIGHT) / 2
		};

		// Do nothing if nothing has changed.
		if (this._oldGridCenter && this._oldGridCenter.x === this._gridCenter.x
			&& this._oldGridCenter.y === this._gridCenter.y) {
			return;
		}

		// #ifdef SERVER
		if (ige.isServer) {
			this._physicsOffset = this._gridCenter;

			if (this._oldGridCenter) {
				var physicsTranslation = {
					x: this._gridCenter.x - this._oldGridCenter.x,
					y: this._gridCenter.y - this._oldGridCenter.y
				};

				var theta = this.rotate().z();

				var rotatedEntityTranslation = MathUtils.rotate(physicsTranslation, theta);

				this.translate().x(this.translate().x() + rotatedEntityTranslation.x);
				this.translate().y(this.translate().y() + rotatedEntityTranslation.y);
			}
		}
		// #else
		else {
			this._effectsAboveContainer.translateTo(-this._gridCenter.x, -this._gridCenter.y, 0);
			this._effectsBelowContainer.translateTo(-this._gridCenter.x, -this._gridCenter.y, 0);
			this._renderContainer.translateTo(-this._gridCenter.x, -this._gridCenter.y, 0);
		}

		if (this._oldGridCenter && ige.isClient) {
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

		/*if (this._oldGridCenter && ige.isClient) {
			var counterTranslation = {
				x: this._gridCenter.x - this._oldGridCenter.x,
				y: this._gridCenter.y - this._oldGridCenter.y
			};

			console.log("Inverse of rendering translation: ");
			console.log(counterTranslation);

			var theta = this.rotate().z();

			var rotatedCounterTranslation = {
				x: Math.cos(theta) * counterTranslation.x - Math.sin(theta) * counterTranslation.y,
				y: Math.sin(theta) * counterTranslation.x + Math.cos(theta) * counterTranslation.y
			};

			console.log("Counter translating...");
			console.log(rotatedCounterTranslation);

			this.translateBy(
				rotatedCounterTranslation.x,
				rotatedCounterTranslation.y,
				0
			);
		}*/
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
