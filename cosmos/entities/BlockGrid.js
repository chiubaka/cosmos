/**
 * The BlockGrid class is a data structure. This is one of the most important structures in the game, since it is the
 * backing for all structures in the game world.
 *
 * The BlockGrid should never concern itself with specific game logic. The BlockGrid is a data structure, and it aims
 * to store blocks in a format that is convenient, accessible, and efficient.
 * @class
 * @typedef {Object} BlockGrid
 * @namespace
 */
var BlockGrid = IgeEntityBox2d.extend({
	classId: 'BlockGrid',

	/**
	 * The total number of blocks that are in this grid.
	 * @type {number}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_numBlocks: undefined,
	/**
	 * The main backing structure of the BlockGrid. _grid is a dictionary. At the top level, the dictionary keys are
	 * x-coordinates in the grid space. Each top level x-coordinate dictionary key maps to another dictionary as its
	 * value. The second-level dictionary keys are y-coordinates in the grid space. The values for the second-level keys
	 * are references to objects of the Block type and its subclasses.
	 *
	 * We choose this representation of the grid because it creates a sparse representation of the Blocks in the grid.
	 * Previously, we had a design where the grid was a rectangular matrix where all spaces that were not filled with
	 * blocks had to hold an "undefined" value. The sparser design eliminates the need for placeholders such as these,
	 * and makes the grid representation more flexible (we no longer need to resize and copy our arrays in order to
	 * resize the grid).
	 *
	 * This design also supports blocks of varying sizes. The general strategy for this is to store multiple references
	 * to the same Block object in several indices in the grid. A 2x2 Block would therefore have four neighboring
	 * entries in the grid. This is done so that it is easy to access a Block based on its index, which will be
	 * important for finding the neighbors of blocks when applying flood fill algorithms.
	 * @type {Object}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_grid: undefined,
	/**
	 * Categorizes all of the blocks in this grid into lists of blocks that have the same classId. This is useful for
	 * cases where we need to know, for example, how many EngineBlocks are in a BlockGrid. Again, the BlockGrid is
	 * intended to support basic querying on this structure, but it SHOULD NOT handle higher level logic regarding the
	 * contents of the grid.
	 * @type {Object}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_blocksByType: undefined,
	/**
	 * Stores all of the blocks in this grid. Useful in cases where we need to iterate over all of the blocks in this
	 * grid.
	 * @type {Array}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_blocksList: undefined,
	/**
	 * The leftmost row index of the structure contained within this {@link BlockGrid}. Necessary because indices
	 * within the BlockGrid can become arbitrarily defined as the {@link BlockGrid} expands.
	 * This property is edited internally by {@link BlockGrid}, but should only ever read by outsiders, never modified.
	 * @type {number}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_startRow: undefined,
	/**
	 * The rightmost row index of the structure contained within this {@link BlockGrid}. Necessary because indices
	 * within the BlockGrid can become arbitrarily defined as the {@link BlockGrid} expands.
	 * This property is edited internally by {@link BlockGrid}, but should only ever read by outsiders, never modified.
	 * @type {number}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_endRow: undefined,
	/**
	 * The topmost col index of the structure contained within this {@link BlockGrid}. Necessary because indices
	 * within the BlockGrid can become arbitrarily defined as the {@link BlockGrid} expands.
	 * This property is edited internally by {@link BlockGrid}, but should only ever read by outsiders, never modified.
	 * @type {number}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_startCol: undefined,
	/**
	 * The bottommost col index of the structure contained within this {@link BlockGrid}. Necessary because indices
	 * within the BlockGrid can become arbitrarily defined as the {@link BlockGrid} expands.
	 * This property is edited internally by {@link BlockGrid}, but should only ever read by outsiders, never modified.
	 * @type {number}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_endCol: undefined,
	/**
	 * The rendering container for this BlockGrid, which essentially provides a cacheable location for the
	 * {@link BlockGrid}'s texture. Without this, the {@link BlockGrid} is re-drawn on each tick, which kills
	 * performance on most machines.
	 * @type {RenderContainer}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_renderContainer: undefined,
	/**
	 * Flag for determining whether or not debug shadow entities should be added to track the location of this
	 * {@link BlockGrid}'s Box2D fixtures.
	 * @type {boolean}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_debugFixtures: false,

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

	init: function(data) {
		var self = this;

		IgeEntityBox2d.prototype.init.call(this);

		this._numBlocks = 0;
		this._grid = {};
		this._blocksByType = {};
		this._blocksList = [];

		this._startCol = 0;
		this._startRow = 0;
		this._endCol = 0;
		this._endRow = 0;
		this._previouslyStreamed = {};

		if (ige.isServer) {
			this.box2dBody({
				type: 'dynamic',
				linearDamping: 0.4,
				angularDamping: 0.8,
				allowSleep: true,
				bullet: false,
				gravitic: false,
				fixedRotation: false,
			});

			this.streamControl(this._streamControlFunc.bind(this))
		}
		else {
			this.addComponent(PixiRenderableComponent);
			this.depth(BlockGrid.DEPTH);
			this._renderContainer = new RenderContainer()
				.mount(this);
			this.fromBlockTypeMatrix(data.blockTypeMatrix, false, data.startRow, data.startCol);

			this.mouseDown(this._mouseDownHandler);
		}
	},

	/**
	 * Packages data to send from the server to the client when this entity is created. Returned data will be passed
	 * to the client-side entity in the {@link BlockGrid#init} function.
	 * @returns {Array} A matrix of block class ID's, which can be used to reconstruct the types of blocks in this
	 * {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @instance
	 */
	streamCreateData: function() {
		return {
			startRow: this.startRow(),
			startCol: this.startCol(),
			blockTypeMatrix: this.toBlockTypeMatrix()
		}
	},

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
		// TODO: Make a proper entity preloader.
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

	/**
	 * Returns an iterator object, which has a next() function that returns the next {@link Block} in this
	 * {@link BlockGrid}. This should be used whenever iterating over all of the {@link Block}s in a {@link BlockGrid}
	 * because it decouples the interface from the underlying {@link BlockGrid} implementation.
	 * @returns {{list: Array, i: number, next: next}}
	 * @memberof BlockGrid
	 * @instance
	 */
	iterator: function() {
		var self = this;

		return {
			list: self._getBlockList(),
			i: 0,
			hasNext: function() {
				return this.i < this.list.length;
			},
			next: function() {
				var block = this.list[this.i];
				this.i++;
				return block;
			}
		};
	},

	/**
	 * Returns the block at a given row and column in the BlockGrid.
	 * @param row {number} The row index to get
	 * @param col {number} The col index to get
	 * @returns {Block|undefined} The Block object at (row, col) or undefined if no Block exists at the specified row and column
	 * @memberof BlockGrid
	 * @instance
	 */
	get: function(row, col) {
		// Check whether or not the dictionary has any entries for the given row value and the given column value.
		if (row === undefined || col === undefined || this._grid[row] === undefined
			|| this._grid[row][col] === undefined) {
			return undefined;
		}

		return this._grid[row][col];
	},

	/**
	 * Adds a Block at the specified row and col.
	 * @param row {number} The row to add at
	 * @param col {number} The col to add at
	 * @param block {Block} The Block to add to the grid.
	 * @param checkForNeighbors {boolean?} Whether or not we should validate that the given {@link Block} will be
	 * attached to the existing structure in this {@link BlockGrid}. Default behavior is to check for neighbors.
	 * @returns {boolean} True if the Block was added successfully to the grid. False otherwise. A Block may not be
	 * successfully added to the grid if another Block already exists in the grid at the specified location or if the
	 * parameters passed to this function are invalid.
	 * @memberof BlockGrid
	 * @instance
	 */
	add: function(row, col, block, checkForNeighbors) {
		// Guard against invalid parameters
		if (row === undefined || col === undefined || block === undefined) {
			return false;
		}

		// See if this would be a valid addition to the BlockGrid.
		if (!this._canAdd(row, col, block, checkForNeighbors)) {
			return false;
		}

		// Store the row and col in the block so that we can figure out where we are from the block.
		block.row(row).col(col);

		// Give the block a back pointer to this BlockGrid.
		block.blockGrid(this);

		// Recompute the starting row and column of this BlockGrid based on the newly added block.
		// It is important that this call occur before the call to BlockGrid#_updateDimensions, because
		// BlockGrid#_updateDimensions relies upon BlockGrid#numRows and BlockGrid#numCols, whose values are not
		// updated until after BlockGrid#_addToGridRange is called.
		this._addToGridRange(block);

		// Updates the height and width of the BlockGrid#_renderContainer and the BlockGrid itself.
		// BlockGrid#_updateDimensions relies on BlockGrid#numRows and BlockGrid#numCols, which are updated by
		// BlockGrid#_addToGridRange, so it is imperative that this call happen after BlockGrid#_addToGridRange when
		// adding new blocks.
		var updated = this._updateDimensions();

		// Mount the block for rendering purposes. Also translates the new block to where it should be.
		this._mountBlock(block);

		if (!ige.isServer) {
			// Forces the BlockGrid#_renderContainer to redraw itself. It is important that this call be made after
			// BlockGrid#_mountBlock and BlockGrid#_updateDimensions so that the rendering data is actually changed before
			// we ask the BlockGrid#_renderContainer to redraw itself.
			this._renderContainer.refresh();
		}

		// Now that we know it is OK to add the block, we should set the reference at each grid location to be a
		// reference to the provided block.
		this._setBlock(block);

		// Keep track of this block in the dictionary of lists that keeps a separate list of blocks by classId
		this._addToBlocksByType(block);

		// Check if we need to change the category of this object so that it is not considered for being attracted
		// into the player's ship.
		this._checkSmallAsteroidCategory();

		if (updated) {
			// Add fixtures to update the server's physics model.
			this._updateFixtures();
		}

		this._addFixture(block);

		// Add this block to the list of all blocks in the BlockGrid. It is important that this occur after
		// BlockGrid#_updateDimensions because BlockGrid#_updateDimensions uses BlockGrid#_blocksList to determine
		// which blocks to translate. We don't want BlockGrid#_updateDimensions to see the new block, because this
		// messes with its calculation of how much to translate the BlockGrid#_renderContainer by.
		this._blocksList.push(block);

		this._numBlocks++;

		block.onAdded();

		return true;
	},

	/**
	 * Removes the {@link Block} at the specified row and column from the grid and creates a {@link Drop} for the
	 * removed {@link Block}.
	 * @param row {number} The row of the {@link Block} to drop.
	 * @param col {number} The col of the {@link Block} to drop.
	 * @param player {IgeEntityBox2d} The {@link Player} that caused this {@link Block} to be dropped. Used to constrain
	 * who can pick up the {@link Drop}. If undefined, all players will be able to pick up the {@link Drop}.
	 * @memberof BlockGrid
	 * @instance
	 */
	drop: function(row, col, player) {
		if (row === undefined || col === undefined) {
			return;
		}

		var block = this.get(row, col);
		if (block === undefined) {
			return;
		}

		// Calculate position of new Drop, taking into account rotation
		var gridX = this.translate().x();
		var gridY = this.translate().y();
		var fixtureX = block.fixtureDef().shape.data.x;
		var fixtureY = block.fixtureDef().shape.data.y;
		var theta = this.rotate().z();

		var finalX = Math.cos(theta) * fixtureX - Math.sin(theta) * fixtureY + gridX;
		var finalY = Math.sin(theta) * fixtureX + Math.cos(theta) * fixtureY + gridY;

		this.remove(row, col);

		new Drop().mount(ige.server.spaceGameScene)
			.block(block)
			.owner(player.currentShip())
			.translateTo(finalX, finalY, 0)
			.rotate().z(theta)
			.streamMode(1);
	},

	/**
	 * Removes the block at the specified row and column from the grid.
	 * NOTE: Destroys this {@link BlockGrid} if the number of {@link Block}s in the {@link BlockGrid} reaches 0 after
	 * removal. If there is state that you need about the {@link BlockGrid} (e.g. the location), you must save it before
	 * calling {@link BlockGrid#remove|remove}.
	 * @param row {number} The row of the block to remove.
	 * @param col {number} The col of the block to remove.
	 * @memberof BlockGrid
	 * @instance
	 */
	remove: function(row, col) {
		if (row === undefined || col === undefined) {
			return;
		}

		var block = this.get(row, col);

		// Remove this block from the list of all blocks in this BlockGrid.
		this._blocksList.splice(this._blocksList.indexOf(block), 1);
		this._unsetBlock(block);
		this._removeFromBlocksByType(block);

		if (block.effectsMountAbove() !== undefined) {
			block.effectsMountAbove().unMount();
		}
		if (block.effectsMountBelow() !== undefined) {
			block.effectsMountBelow().unMount();
		}

		if (ige.isServer) {
			this._box2dBody.DestroyFixture(block.fixture());
			if (this._debugFixtures) {
				block.fixtureDebuggingEntity().destroy();
			}

			// TODO: Compute correct velocities for new bodies, if needed

			// TODO: Split BlockGrids and make 1x1 asteroids smallAsteroids so
			// they get attracted

			// TODO: Implement flood fill algorithm to disconnect disjoint bodies from each other.
			// FLOOD FILL MUST NOT DESTROY THIS BlockGrid!
		}

		this._numBlocks--;

		this._removeFromGridRange(block);

		var updated = this._updateDimensions();

		if (updated) {
			this._updateFixtures();
		}

		block.onRemoved();

		block.unMount();

		// Destroy this BlockGrid to clean up memory.
		if (this._numBlocks === 0) {
			this.destroy();
		}
	},

	/**
	 * Adds an effect to a {@link Block} in this {@link BlockGrid}
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the mining laser.
	 * @memberof BlockGrid
	 * @instance
	 */
	addEffect: function(effect) {
		var block = this.get(effect.sourceBlock.row, effect.sourceBlock.col);

		block.addEffect(effect);
	},

	/**
	 * Removes an effect from a {@link Block} in this {@link BlockGrid}
	 * @param effect {Object} An effect object containing information for the type of effect, the source block
	 * (block on which to mount the effect), and an optional target block for effects like the mining laser.
	 * @memberof BlockGrid
	 * @instance
	 */
	removeEffect: function(effect) {
		var block = this.get(effect.sourceBlock.row, effect.sourceBlock.col);

		block.removeEffect(effect);
	},

	/**
	 * Creates the above effects mount for the given {@link Block} and moves the mount to the correct location based on where
	 * the {@link Block} is in the grid. An effects mount is a blank IGE Entity that is used to correctly position
	 * effects for blocks (e.g. mining particles or engine particles). Effects mounts are associated with {@link Block}s
	 * and their location is updated anytime the {@link Block}s in this {@link BlockGrid} move.
	 * @param block {Block} The {@link Block} to create an effects mount for.
	 * @memberof BlockGrid
	 * @instance
	 */
	createAboveEffectsMount: function(block) {
		block.createAboveEffectsMount();
		this.updateEffect(block);
	},

	/**
	 * Creates the below effects mount for the given {@link Block} and moves the mount to the correct location based on where
	 * the {@link Block} is in the grid. An effects mount is a blank IGE Entity that is used to correctly position
	 * effects for blocks (e.g. mining particles or engine particles). Effects mounts are associated with {@link Block}s
	 * and their location is updated anytime the {@link Block}s in this {@link BlockGrid} move.
	 * @param block {Block} The {@link Block} to create an effects mount for.
	 * @memberof BlockGrid
	 * @instance
	 */
	createBelowEffectsMount: function(block) {
		block.createBelowEffectsMount();
		this.updateEffect(block);
	},


	/**
	 * Moves the effects mount(s) of the given {@link Block} to the correct position based on the {@link Block}'s position
	 * in the grid. Also handles mounting the effect mount(s) of the {@link Block} to this {@link BlockGrid} if it has not
	 * already been mounted.
	 * @param block {Block} The {@link Block} to update the effects mount(s) for.
	 * @memberof BlockGrid
	 * @instance
	 */
	updateEffect: function(block) {
		var effectsMountAbove = block.effectsMountAbove();
		var effectsMountBelow = block.effectsMountBelow();
		var drawLocation = this._drawLocationForBlock(block);

		if (effectsMountAbove !== undefined) {
			if (effectsMountAbove.parent() !== this) {
				effectsMountAbove.mount(this);
			}
			effectsMountAbove.translateTo(drawLocation.x, drawLocation.y, 0);
		}

		if (effectsMountBelow !== undefined) {
			if (effectsMountBelow.parent() !== this) {
				effectsMountBelow.mount(this);
			}
			effectsMountBelow.translateTo(drawLocation.x, drawLocation.y, 0);
		}
	},

	/**
	 * Given a {@link Block} type as a class ID, returns a list of the {@link Block}s in this {@link BlockGrid} that
	 * have that type.
	 * @param classId {string} The type of {@link Block}s to return.
	 * @returns {Array} An array of the {@link Block}s in this {@link BlockGrid} that have the given classId. If an
	 * undefined or non-{@link Block} type classId is passed, this function will return an empty array.
	 * @memberof BlockGrid
	 * @instance
	 */
	blocksOfType: function(classId) {
		if (this._blocksByType[classId] === undefined) {
			return [];
		}

		return this._blocksByType[classId];
	},

	/**
	 * Returns the number of blocks in the grid that have the specified class ID
	 * @param classId {string} The class ID of the type of block that the caller wants the number of
	 * @returns {number} The number of blocks in the grid with the specified class ID
	 * @memberof BlockGrid
	 * @instance
	 */
	numBlocksOfType: function(classId) {
		return this.blocksOfType(classId).length;
	},

	/**
	 * Gets the leftmost row that any {@link Block} occupies in this {@link BlockGrid}.
	 * @returns {number}
	 * @memberof BlockGrid
	 * @instance
	 */
	startRow: function() {
		return this._startRow;
	},

	/**
	 * Gets the rightmost row that any {@link Block} occupies in this {@link BlockGrid}.
	 * @returns {number}
	 * @memberof BlockGrid
	 * @instance
	 */
	endRow: function() {
		return this._endRow;
	},

	/**
	 * Gets the topmost row that any {@link Block} occupies in this {@link BlockGrid}.
	 * @returns {number}
	 * @memberof BlockGrid
	 * @instance
	 */
	startCol: function() {
		return this._startCol;
	},

	/**
	 * Gets the bottommost row that any {@link Block} occupies in this {@link BlockGrid}.
	 * @returns {number}
	 * @memberof BlockGrid
	 * @instance
	 */
	endCol: function() {
		return this._endCol;
	},

	/**
	 * Returns the number of rows that this {@link BlockGrid} spans. Effectively, this is the length of the longest
	 * column in the {@link BlockGrid}.
	 * @returns {number} The number of rows that this {@link BlockGrid} spans.
	 * @memberof BlockGrid
	 * @instance
	 * @readonly
	 */
	numRows: function() {
		return this.endRow() - this.startRow() + 1;
	},

	/**
	 * Returns the number of cols that this {@link BlockGrid} spans. Effectively, this is the length of the longest
	 * row in the {@link BlockGrid}.
	 * @returns {number} The number of cols that this {@link BlockGrid} spans.
	 * @memberof BlockGrid
	 * @instance
	 * @readonly
	 */
	numCols: function() {
		return this.endCol() - this.startCol() + 1;
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
				// The add() function knows how to deal with receiving undefined
				this.add(startRow + row, startCol + col, Block.blockFromClassId(blockTypeMatrix[row][col]), checkForNeighbors);
			}
		}

		return this;
	},

	/**
	 * Takes this BlockGrid and converts it to a matrix of class ID's, where each class ID represents a single type of block
	 * in the BlockGrid.
	 * This is used for serializing a BlockGrid object.
	 * @returns {Array} An array of arrays that holds classId's for Block objects. undefined is used to
	 * indicate that a space in the blockTypeMatrix does not include a Block. The blockTypeMatrix must be a rectangular
	 * matrix (every row has the same number of columns and every column has the same number of rows, but the total number
	 * of rows and total number of columns is not required to be the same).
	 * @memberof BlockGrid
	 * @instance
	 */
	toBlockTypeMatrix: function() {
		var blockTypeMatrix = [];
		var endRow = this.endRow();
		var endCol = this.endCol();

		for (var row = this.startRow(); row <= endRow; row++) {
			var rowList = [];
			for (var col = this.startCol(); col <= endCol; col++) {
				var block = this.get(row, col);
				if (block === undefined) {
					rowList.push(undefined);
				}
				else {
					rowList.push(block.classId());
				}
			}
			blockTypeMatrix.push(rowList);
		}

		return blockTypeMatrix;
	},

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
				this.add(row, col, blockMatrix[row][col], checkForNeighbors);
			}
		}

		return this;
	},

	/**
	 * Overrides the Object#toString method.
	 * @returns {Array} An array, which can be written out as a string. The array contains the class ID's for the
	 * {@link Block} in this {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @instance
	 */
	toString: function() {
		return this.toBlockTypeMatrix();
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

	/**
	 * Process actions on {@link Block}s client-side.
	 * @param data {Object} An object representing the action sent from the server.
	 * @memberof BlockGrid
	 * @instance
	 */
	processBlockActionClient: function(data) {
		switch (data.action) {
			case 'remove':
				this.remove(data.row, data.col);
				this._renderContainer.refresh();
				break;
			case 'damage':
				var block = this.get(data.row, data.col);
				block.takeDamage(data.amount);
				break;
			case 'add':
				ige.client.metrics.fireEvent(
					'construct',
					'existing',
					Block.blockFromClassId(data.selectedType)
				);
				this.add(data.row, data.col, Block.blockFromClassId(data.selectedType));
				ige.emit('cosmos:BlockGrid.processBlockActionClient.add', [data.selectedType, this] );
				this._renderContainer.refresh();
				break;
			default:
				this.log('Cannot process block action ' + data.action + ' because no such action exists.', 'warning');
		}
	},

	/**
	 * Gets/sets the {@link BlockGrid#_debugFixtures|_debugFixtures}, which tells the {@link BlockGrid} whether or not
	 * it should create shadow entities for the fixtures of this {@link BlockGrid}. This helps to visualize the fixtures
	 * so that they can be debugged. The {@link BlockGrid#_debugFixtures|_debugFixtures} flag must be set to true
	 * before any {@link Block}s are added to this {@link BlockGrid} for visualization to occur.
	 * @param flag {boolean} Optional parameter. If provided, the flag will be used as the new value of
	 * {@link BlockGrid#_debugFixtures|_debugFixtures}
	 * @return {*} If no argument is provided, returns the current value of
	 * {@link BlockGrid#_debugFixtures|_debugFixtures}. Otherwise, returns this object to make setter call chaining
	 * convenient.
	 * @memberof BlockGrid
	 * @instance
	 */
	debugFixtures: function(flag) {
		if (flag === undefined) {
			return this._debugFixtures;
		}

		this._debugFixtures = flag;
		return this;
	},

	/**
	 * Given a {@link Block}, returns the neighboring locations to the {@link Block} that do not have other blocks.
	 * @param block {Block} The {@link Block} to get the emptying neighboring locations for.
	 * @returns {Array} A list of location objects, which are of the format {row: number, col: number}. Each location
	 * represents a location neighboring the given {@link Block} that did not have a neighbor.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_emptyNeighboringLocations: function(block) {
		var emptyNeighboringLocations = [];
		var neighboringLocations = this._neighboringLocations(block.row(), block.col(), block);

		for (var i = 0; i < neighboringLocations.length; i++) {
			var location = neighboringLocations[i];

			if (!this._isOccupied(location.row, location.col)) {
				emptyNeighboringLocations.push(location);
			}
		}

		return emptyNeighboringLocations;
	},

	/**
	 * Creates and returns a list of all of the {@link Block}s in this {@link BlockGrid}. There is no guarantee about
	 * the order of the {@link Block}s returned by this function.
	 * @returns {Array} An array that contains all of the {@link Block} objects kept in this {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_getBlockList: function() {
		return this._blocksList;
	},

	/**
	 * Removes all existing blocks from the grid.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_removeAll: function() {
		var iterator = this.iterator();
		while (iterator.hasNext()) {
			var block = iterator.next();
			this.remove(block.row(), block.col());
		}
	},

	/**
	 * Checks whether or not the given block can be added at the specified row and col. For blocks that are larger than
	 * 1x1, row and col specify the top left grid space coordinate of the block.
	 * @param row {number} The row to add at. If the block is larger than 1x1, this is the row for the top left corner of
	 * the block
	 * @param col {number} The col to add at. If the block is larger than 1x1, this is the col for the top left corner of
	 * the block
	 * @param block {Block} The block to add. If the block is larger than 1x1, all spaces where the block would occupy
	 * are checked.
	 * @param checkForNeighbors {boolean} Whether or not we should validate that the given {@link Block} will be
	 * attached to the existing structure in this {@link BlockGrid}. Default behavior is to check for neighbors.
	 * @returns {boolean} True if nothing prevents this block from being placed at the given row and col. False
	 * otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_canAdd: function(row, col, block, checkForNeighbors) {
		// If this is the first block we are placing in the grid, there are no restrictions.
		if (this._numBlocks === 0) {
			return true;
		}

		// Check to see if the spaces the provided block will occupy are already occupied.
		if (this._isOccupiedBlock(row, col, block)) {
			return false;
		}

		// Make sure that the block will be connected to the existing structure. Disjoint structures are not allowed.
		if ((checkForNeighbors !== undefined && checkForNeighbors !== true) || this._hasNeighbors(row, col, block)) {
			return true;
		}
		else {
			console.log("Cannot add because the proposed addition is not attached to the existing structure."
				+ " row: " + row
				+ ", col: " + col
				+ ", block: " + block.classId()
			);
			return false;
		}
	},

	/**
	 * Calls the _isOccupied function for all
	 * @param row {number} The row for the top left corner of the block.
	 * @param col {number} The col for the top left corner of the block.
	 * @param block {Block} The block to check space for.
	 * @returns {boolean}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_isOccupiedBlock: function(row, col, block) {
		for (var y = 0; y < block.numRows(); y++) {
			for (var x = 0; x < block.numCols(); x++) {
				if (this._isOccupied(row + y, col + y)) {
					return true;
				}
			}
		}
	},

	/**
	 * Checks whether or not a grid location is occupied.
	 * @param row {number} The row to check.
	 * @param col {number} The col to check.
	 * @returns {boolean} True if the grid location is occupied (occupant !== undefined). False otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_isOccupied: function(row, col) {
		return this._grid[row] !== undefined && this._grid[row][col] !== undefined;
	},

	/**
	 * Checks whether or not the provided block would has neighbors if placed at the specified row and col.
	 * @param row {number} The row representing the top left corner of the block.
	 * @param col {number} The col representing the top left corner of the block.
	 * @param block {Block} The block to check neighbors for.
	 * @returns {boolean} True if an adjacent grid location is occupied. False otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_hasNeighbors: function(row, col, block) {
		var neighboringLocations = this._neighboringLocations(row, col, block);

		for (var i = 0; i < neighboringLocations.length; i++) {
			var location = neighboringLocations[i];
			if (this._isOccupied(location.row, location.col)) {
				return true;
			}
		}
	},

	/**
	 * Given a location for a {@link Block}, determines whether or not there are open locations neighboring that
	 * {@link Block}.
	 * @param row {number} The row of the {@link Block} to check.
	 * @param col {number} The col of the {@link Block} to check.
	 * @param block {Block} The {@link Block} to check.
	 * @returns {boolean} True if there is an open location neighboring the given {@link Block}. False otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_hasNeighboringOpenLocations: function(row, col, block) {
		var neighboringOpenLocations = this._neighboringOpenLocations(row, col, block);
		return neighboringOpenLocations.length > 0;
	},

	/**
	 * Returns a list of non-occupied locations neighboring the given {@link Block}
	 * @param row {number} The row of the {@link Block} to find open neighboring locations for.
	 * @param col {number} The col of the {@link Block} to find open neighboring locations for.
	 * @param block {Block} The {@link Block} to find open neighboring locations for.
	 * @returns {Array} A list of locations neighboring the given {@link Block} that are not occupied by other
	 * {@link Block}s.
	 * @private
	 */
	_neighboringOpenLocations: function(row, col, block) {
		var neighboringLocations = this._neighboringLocations(row, col, block);
		var neighboringOpenLocations = [];

		for (var i = 0; i < neighboringLocations.length; i++) {
			var location = neighboringLocations[i];
			if (!this._isOccupied(location.row, location.col)) {
				neighboringOpenLocations.push(location);
			}
		}

		return neighboringOpenLocations;
	},

	/**
	 * Creates a list of the locations that neighbor this {@link Block}. Utility function that makes it easy for other
	 * functions that need to check locations that neighbor a {@link Block} to iterate over neighbors of a
	 * {@link Block}.
	 * @param row {number} The top left row of the {@link Block}.
	 * @param col {number} The top left col of the {@link Block}.
	 * @param block {Block} The {@link Block} to find neighboring locations for.
	 * @returns {Array} A list of the locations that neighbor the given {@link Block}. Location objects are in the
	 * format {row: number, col: number}.
	 * @private
	 */
	_neighboringLocations: function(row, col, block) {
		var neighboringLocations = [];
		var blockNumRows = block.numRows();
		var blockNumCols = block.numCols();

		// Check top and bottom boundaries
		var startCol = col;
		var topRow = row - 1;
		var bottomRow = row + blockNumRows;

		for (var x = 0; x < blockNumCols; x++) {
			neighboringLocations.push({row: topRow, col: startCol + x});
			neighboringLocations.push({row: bottomRow, col: startCol + x});
		}

		// Check left and right boundary
		var startRow = row;
		var leftCol = col - 1;
		var rightCol = col + blockNumCols;

		for (var y = 0; y < blockNumRows; y++) {
			neighboringLocations.push({row: startRow + y, col: leftCol});
			neighboringLocations.push({row: startRow + y, col: rightCol});
		}

		return neighboringLocations;
	},

	/**
	 * Checks whether or not the category of this BlockGrid should be changed. BlockGrids with single blocks are
	 * considered small asteroids and marked to be attracted by nearby players. However, when a block is added to a
	 * small asteroid BlockGrid, it is no longer a single block BlockGrid and is not considered a small asteroid, so
	 * attraction will no longer work on this BlockGrid.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_checkSmallAsteroidCategory: function() {
		// Make sure we don't attract formerly small asteroids
		if (this.category() === 'smallAsteroid' && this._numBlocks > 1) {
			// Don't use getter/setter because undefined gets value
			this._category = undefined;
		}
	},

	/**
	 * Calls the _set() function for all of the spaces associated with a Block.
	 * @param block {Block} The {@link Block} reference to set at each location. The {@link Block} should have its
	 * row and column properties set already.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_setBlock: function(block) {
		var row = block.row();
		var col = block.col();
		for (var y = 0; y < block.numRows(); y++) {
			for (var x = 0; x < block.numCols(); x++) {
				this._set(row + y, col + x, block);
			}
		}
	},

	/**
	 * Sets a location in the grid. Makes sure that the necessary sub-dictionaries exist and have been created. This
	 * function sets ONE GRID SPACE. In order to set for blocks larger than 1x1, _set() must be called multiple times.
	 * @param row {number} The row to set.
	 * @param col {number} The col to set.
	 * @param block {Block} The block reference to place at the specified grid location.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_set: function(row, col, block) {
		if (!this._hasColInRow(row, col)) {
			this._createColInRow(row, col);
		}

		this._grid[row][col] = block;
	},

	/**
	 * Calls the _unset() function for all of the spaces associated with a Block.
	 * @param block {Block} The block to unset.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_unsetBlock: function(block) {
		var row = block.row();
		var col = block.col();
		for (var y = 0; y < block.numRows(); y++) {
			for (var x = 0; x < block.numCols(); x++) {
				this._unset(row + y, col + x);
			}
		}
	},

	/**
	 * Unsets a single location in the grid. If unsetting this location would result in an empty row, the row is
	 * deleted from the grid as well.
	 * @param row {number} The row to unset.
	 * @param col {number} The col to unset.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_unset: function(row, col) {
		if (!this._hasColInRow(row, col)) {
			return;
		}

		delete this._grid[row][col];

		// TODO: Object.keys() likely requires linear time in the number of elements to help us figure out if the row
		// is empty. Consider storing the number of elements in each row and column separately, since this linear check
		// will not be worth it most of the time (since most rows will be larger than one element large), and will thus
		// be a waste of time in general. We will eventually want removal to be very fast, and this is one potential
		// bottleneck.
		if (Object.keys(this._grid[row]).length === 0) {
			delete this._grid[row];
		}
	},

	/**
	 * Checks whether or not the grid has the specified row. Since the grid is represented sparsely, it is possible we
	 * have not added an entry for this row yet.
	 * @param row {number} The row to check for.
	 * @returns {boolean} True if the grid already has this row. False otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_hasRow: function(row) {
		return this._grid[row] !== undefined;
	},

	/**
	 * Creates an empty dictionary for the specified row.
	 * @param row {number} The row to create.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_createRow: function(row) {
		this._grid[row] = {};
	},

	/**
	 * Checks whether or not the grid has the specified col in the specified row. Since the grid is represented
	 * sparsely, it is possible we have not added an entry for this row and col yet.
	 * @param row {number} The row to check.
	 * @param col {number} The col to check.
	 * @returns {boolean} True if the grid already has this row and col. False otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_hasColInRow: function(row, col) {
		return this._grid[row] !== undefined && this._grid[row][col] !== undefined;
	},

	/**
	 * Checks whether or not the grid has the specified col.
	 * @param col {number} The col to check.
	 * @returns {boolean} True if the grid has this column. False otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_hasCol: function(col) {
		for (var row in this._grid) {
			if (!this._grid.hasOwnProperty(row)) {
				continue;
			}

			if (this._hasColInRow(row, col)) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Creates an empty dictionary for the specified col in the specified row. If the specified row does not already
	 * exist, the row is also created.
	 * @param row {number} The row to create the col in.
	 * @param col {number} The col to create.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_createColInRow: function(row, col) {
		if (!this._hasRow(row)) {
			this._createRow(row);
		}

		this._grid[row][col] = {};
	},

	/**
	 * Adds the provided block to the _blocksByType dictionary. If this is the first block of this type that we are
	 * encountering, this function will also create the list.
	 * @param block {Block} The block to keep track of.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_addToBlocksByType: function(block) {
		if (this._blocksByType[block.classId()] === undefined) {
			this._blocksByType[block.classId()] = [];
		}
		this._blocksByType[block.classId()].push(block);
	},

	/**
	 * Removes the provided block from the _blocksByType dictionary.
	 * @param block {Block} The block to remove from the _blocksByType dictionary.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_removeFromBlocksByType: function(block) {
		var list = this._blocksByType[block.classId()];
		if (list === undefined) {
			return;
		}

		// TODO: Using a list for the blocks may not be the right approach here. For lists that have lots of blocks,
		// this operation will make block removal slow. In the future, block removal may happen very frequently and
		// we will want to make block removal as fast as possible. This is one potential bottleneck, since indexOf()
		// is an O(n) search for a block.
		var index = list.indexOf(block);
		if (index === -1) {
			return;
		}

		list.splice(index, 1);
	},

	/**
	 * Handles actually mounting the block to the render container
	 * @param block {Block} The {@link Block} to mount. The {@link Block} should have its row and column properties
	 * set already.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_mountBlock: function(block) {
		// Rendering of the blocks only occurs on the client.
		if (ige.isServer) {
			return;
		}

		block.mount(this._renderContainer);
		this._translateBlock(block);
	},

	/**
	 * Updates the Box2D fixtures of the physics model on the server for this {@link BlockGrid}. This effectively
	 * destroys all fixtures and readds them.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_updateFixtures: function() {
		// The physics model is only run on the server.
		if (!ige.isServer) {
			return;
		}

		// If the dimensions have changed, then we need to update the fixtures for all of the blocks.
		var iterator = this.iterator();
		while (iterator.hasNext()) {
			var currentBlock = iterator.next();
			this._addFixture(currentBlock);
		}
	},

	/**
	 * Adds a Box2D fixture to the physics model on the server for the given {@link Block}.
	 * @param block {Block} The {@link Block} that we are adding a fixture for. The {@link Block} should have its row
	 * and column properties set already.
	 * @private
	 */
	_addFixture: function(block) {
		// The physics model is only run on the server
		if (!ige.isServer) {
			return;
		}

		// Update the fixture def
		var fixtureDef = this._createFixtureDef(block);
		block.fixtureDef(fixtureDef);


		// Destroy the existing fixture
		if (block.fixture() !== undefined) {
			this._box2dBody.DestroyFixture(block.fixture());
		}

		// Add a new fixture based on the new fixture def
		block.fixture(ige.box2d.addFixture(this._box2dBody, fixtureDef));

		if (this.debugFixtures()) {
			if (block.fixtureDebuggingEntity() !== undefined) {
				block.fixtureDebuggingEntity().destroy();
			}

			var fixtureDebuggingEntity = new FixtureDebuggingEntity()
				.mount(this)
				.depth(this.depth() + 1)
				.translateTo(fixtureDef.shape.data.x, fixtureDef.shape.data.y, 0)
				.width(fixtureDef.shape.data.width * 2)
				.height(fixtureDef.shape.data.height * 2)
				.streamMode(1);

			block.fixtureDebuggingEntity(fixtureDebuggingEntity);
		}
	},

	/**
	 * Creates and returns a fixture def object for the given {@link Block} by computing the fixture's x, y, width,
	 * and height based on the {@link Block}'s properties.
	 * @param block {Block} The {@link Block} to make a fixture def for.
	 * @returns {b2FixtureDef} A Box2d FixtureDef object, used to create an actual Box2d fixture.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_createFixtureDef: function(block) {
		var drawLocation = this._drawLocationForBlock(block);
		return {
			density: BlockGrid.BLOCK_FIXTURE_DENSITY,
			friction: BlockGrid.BLOCK_FIXTURE_FRICTION,
			restitution: BlockGrid.BLOCK_FIXTURE_RESTITUTION,
			shape: {
				type: 'rectangle',
				data: {
					// The position of the fixture relative to the body
					// The fixtures are slightly smaller than the actual block grid so that you can fit into a hole
					// which is exactly the same width (in terms of blocks) as your ship
					x: drawLocation.x + BlockGrid.BLOCK_FIXTURE_PADDING,
					y: drawLocation.y + BlockGrid.BLOCK_FIXTURE_PADDING,
					width: (block.numCols() * Block.WIDTH) / 2 - (2 * BlockGrid.BLOCK_FIXTURE_PADDING),
					height: (block.numRows() * Block.HEIGHT) / 2 - (2 * BlockGrid.BLOCK_FIXTURE_PADDING)
				}
			}
		};
	},

	/**
	 * Updates the {@link BlockGrid#_startRow|_startRow}, {@link BlockGrid#_startCol|_startCol},
	 * {@link BlockGrid#_endRow|_endRow}, and {@link BlockGrid#_endCol|_endCol} properties based on the addition of
	 * the given {@link Block} to this {@link BlockGrid}.
	 * @param block {Block} The {@link Block} that is being added to the {@link BlockGrid}. The {@link Block} should
	 * have its row and column properties set already.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_addToGridRange: function(block) {
		var startRow = block.row();
		var startCol = block.col();
		var endRow = startRow + block.numRows() - 1;
		var endCol = startCol + block.numCols() - 1;

		if (this._numBlocks === 0) {
			this._setStartRow(startRow);
			this._setEndRow(endRow);

			this._setStartCol(startCol);
			this._setEndCol(endCol);

			return;
		}

		// If the newly added block starts higher than the rest of the blocks in the grid
		if (startRow < this.startRow()) {
			this._setStartRow(startRow);
		}
		// If the newly added block starts more to the left than the rest of the blocks in the grid
		if (startCol < this.startCol()) {
			this._setStartCol(startCol);
		}
		// If the newly added block ends more to the right than the rest of the blocks in the grid
		if (this.endRow() < endRow) {
			this._setEndRow(endRow);
		}
		// If the newly added block ends lower than the rest of the blocks in the grid
		if (this.endCol() < endCol) {
			this._setEndCol(endCol);
		}
	},

	/**
	 * Updates the {@link BlockGrid#_startRow|_startRow}, {@link BlockGrid#_startCol|_startCol},
	 * {@link BlockGrid#_endRow|_endRow}, and {@link BlockGrid#_endCol|_endCol} properties based on the removal of
	 * the given {@link Block} to this {@link BlockGrid}.
	 * @param block {Block} The {@link Block} that is being removed from the {@link BlockGrid}. The {@link Block} should
	 * have its row and column properties set already.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_removeFromGridRange: function(block) {
		if (this._numBlocks === 0) {
			this._setStartRow(0);
			this._setStartCol(0);
			this._setEndRow(0);
			this._setEndCol(0);
			return;
		}

		var startRow = block.row();
		var startCol = block.col();
		var endRow = startRow + block.numRows() - 1;
		var endCol = startCol + block.numCols() - 1;

		var row, col;

		if (startRow === this.startRow()) {
			row = startRow;
			while (!this._hasRow(row)) {
				row++;
			}
			this._setStartRow(row);
		}

		if (startCol === this.startCol()) {
			col = startCol;
			while (!this._hasCol(col)) {
				col++;
			}
			this._setStartCol(col);
		}

		if (endRow === this.endRow()) {
			row = endRow;
			while (!this._hasRow(row)) {
				row--;
			}
			this._setEndRow(row);
		}

		if (endCol === this.endCol()) {
			col = endCol;
			while (!this._hasCol(col)) {
				col--;
			}
			this._setEndCol(col);
		}
	},

	/**
	 * Setter for {@link BlockGrid#_startRow|_startRow}. Private because {@link BlockGrid#_startRow|_startRow} is
	 * read-only to the outside world.
	 * @param newStartRow {number} The new start row of the {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_setStartRow: function(newStartRow) {
		this._startRow = newStartRow;
	},

	/**
	 * Setter for {@link BlockGrid#_endRow|_endRow}. Private because {@link BlockGrid#_endRow|_endRow} is
	 * read-only to the outside world.
	 * @param newEndRow {number} The new end row of the {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_setEndRow: function(newEndRow) {
		this._endRow = newEndRow;
	},

	/**
	 * Setter for {@link BlockGrid#_startCol|_startCol}. Private because {@link BlockGrid#_startCol|_startCol} is
	 * read-only to the outside world.
	 * @param newStartCol {number} The new start col of the {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_setStartCol: function(newStartCol) {
		this._startCol = newStartCol;
	},

	/**
	 * Setter for {@link BlockGrid#_endCol|_endCol}. Private because {@link BlockGrid#_endCol|_endCol} is
	 * read-only to the outside world.
	 * @param newEndCol {number} The new end col of the {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_setEndCol: function(newEndCol) {
		this._endCol = newEndCol;
	},

	/**
	 * Updates the dimensions of this {@link BlockGrid} and its {@link BlockGrid#_renderContainer|_renderContainer}.
	 * Dirties the {@link BlockGrid#_renderContainer|_renderContainer} cache so that it is redrawn to reflect the
	 * dimensions change.
	 * @returns {boolean} True if the dimensions of this BlockGrid needed to be updated. False otherwise.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_updateDimensions: function() {
		// Modify the height and width of the entities to match the new size of the BlockGrid.
		this.height(this.numRows() * Block.HEIGHT);
		this.width(this.numCols() * Block.WIDTH);

		var translationData = this._computeBlockTranslation();

		if (translationData.x === 0 && translationData.y === 0) {
			return false;
		}

		if (!ige.isServer) {
			this._renderContainer.height(this.height());
			this._renderContainer.width(this.width());

			// Translate all existing blocks so that they are in the correct positions relative to the new center.
			//var translationData = {x: 0, y: 0};
			var iterator = this.iterator();
			while (iterator.hasNext()) {
				var block = iterator.next();
				block.translateBy(translationData.x, translationData.y, 0);
				block.cacheDirty(true);
				this.updateEffect(block);
			}
		}
		else {
			// Recalculate aabb on server. This aabb is used to prevent offscreen
			// entities from being streamed to clients.
			this.aabb(true);
		}


		return true;
	},

	/**
	 * Computes the distance that the {@link Block}s in this {@link BlockGrid} will need to be translated in order to
	 * compensate for the {@link BlockGrid}'s bounding box changing.
	 * @returns {{x: number, y: number}} An object that contains the x translation amount and y translation amount that
	 * a {@link Block} will need to be translated to compensate for the resizing of the {@link BlockGrid}.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_computeBlockTranslation: function() {
		if (this._numBlocks === 0) {
			return {x: 0, y: 0};
		}

		// Just get the first block from the list, since the translation will be the same for all Blocks
		var block = this._blocksList[0];

		var oldX = block.translate().x();
		var oldY = block.translate().y();
		var drawLocation = this._drawLocationForBlock(block);

		return {x: drawLocation.x - oldX, y: drawLocation.y - oldY};
	},

	/**
	 * Given a {@link Block}, calculates where the {@link Block} should be drawn onto the screen.
	 * @param block {Block} The {@link Block} to calculate the draw location for
	 * @returns {{x: *, y: *}} An object that has an x property and a y property, which defines the location where the
	 * given {@link Block} should be drawn.
	 * @memberof Block
	 * @private
	 * @instance
	 */
	_drawLocationForBlock: function(block) {
		var x = Block.WIDTH * (block.col() - this.startCol()) - this._bounds2d.x2 + block._bounds2d.x2;
		var y = Block.HEIGHT * (block.row() - this.startRow()) - this._bounds2d.y2 + block._bounds2d.y2;

		return {x: x, y: y};
	},

	/**
	 * Given a block, translates the block to where it should be in this {@link BlockGrid}'s
	 * {@link BlockGrid#_renderContainer|_renderContainer}.
	 * @param block {Block} The {@link Block} to translate. Contains row and column information inside of it as
	 * properties
	 * @returns {{x: number, y: number}}
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_translateBlock: function(block) {
		var oldX = block.translate().x();
		var oldY = block.translate().y();
		var drawLocation = this._drawLocationForBlock(block);

		block.translateTo(drawLocation.x, drawLocation.y, 0);

		return {x: drawLocation.x - oldX, y: drawLocation.y - oldY};
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

		var row = Math.floor(gridY / Block.HEIGHT) + this.startRow();
		var col = Math.floor(gridX / Block.WIDTH) + this.startCol();

		return this.get(row, col);
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
	 * Abstract function. Stub implementation that does nothing, but should be overriden by subclasses. This function is
	 * called when the {@link BlockGrid} is clicked. It passes the {@link Block} that was clicked after figuring out
	 * which {@link Block} that was.
	 * @param block {Block} The {@link Block} in the {@link BlockGrid} that was clicked.
	 * @param event {Object} The data about the click event. SHOULD NOT BE TRUSTED FOR POSITIONAL DATA because the
	 * {@link BlockGrid} does not update these things before passing them down.
	 * @param control {Object} The control data associated with the click event.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_blockClickHandler: function(block, event, control) {

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

/**
 * The depth layer to place {@link BlockGrid}s on.
 * @constant {number}
 * @memberof BlockGrid
 */
BlockGrid.DEPTH = 0;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
