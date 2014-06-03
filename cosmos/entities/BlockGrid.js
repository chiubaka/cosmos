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
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_startRow: undefined,
	/**
	 * The rightmost row index of the structure contained within this {@link BlockGrid}. Necessary because indices
	 * within the BlockGrid can become arbitrarily defined as the {@link BlockGrid} expands.
	 * This property is edited internally by {@link BlockGrid}, but should only ever read by outsiders, never modified.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_endRow: undefined,
	/**
	 * The topmost col index of the structure contained within this {@link BlockGrid}. Necessary because indices
	 * within the BlockGrid can become arbitrarily defined as the {@link BlockGrid} expands.
	 * This property is edited internally by {@link BlockGrid}, but should only ever read by outsiders, never modified.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_startCol: undefined,
	/**
	 * The bottommost col index of the structure contained within this {@link BlockGrid}. Necessary because indices
	 * within the BlockGrid can become arbitrarily defined as the {@link BlockGrid} expands.
	 * This property is edited internally by {@link BlockGrid}, but should only ever read by outsiders, never modified.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_endCol: undefined,
	/**
	 * The row value of the very first {@link Block} added to this {@link BlockGrid}. Stored as a reference point so
	 * that we can easily place the fixtures for future {@link Block}s in the right place relative to a common
	 * reference point that does not change as the height and width of the {@link BlockGrid} and its
	 * {@link BlockGrid#_renderContainer|_renderContainer} change.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_physicsReferenceRow: undefined,
	/**
	 * The col value of the very first {@link Block} added to this {@link BlockGrid}. Stored as a reference point so
	 * that we can easily place the fixtures for future {@link Block}s in the right place relative to a common
	 * reference point that does not change as the height and width of the {@link BlockGrid} and its
	 * {@link BlockGrid#_renderContainer|_renderContainer} change.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_physicsReferenceCol: undefined,
	/**
	 * The rendering container for this BlockGrid, which essentially provides a cacheable location for the BlockGrid's
	 * texture.
	 */
	_renderContainer: undefined,
	_constructionZoneOverlay: undefined,
	_debugFixtures: false,
	// Default 10 padding on all sides
	_padding: 10,

	init: function(data) {
		var self = this;

		IgeEntityBox2d.prototype.init.call(this);

		this._numBlocks = 0;
		this._grid = {};
		this._blocksByType = {};
		this._blocksList = [];

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
		}
		else {
			this._renderContainer = new RenderContainer()
				.mount(this);
			this.fromBlockTypeMatrix(data, false);

			// TODO: Lazily create when needed to speed up load time.
			// TODO: Examine ConstructionZoneOverlay to make sure it is compatible with new BlockGrid backing.
			// TODO: Uncomment this. Commented out so I can test the new BlockGrid class without getting errors from
			// the ConstructionZoneOverlay class.
			//this._constructionZoneOverlay = new ConstructionZoneOverlay(this._grid)
			//	.mount(this);

			this.mouseDown(this.mouseDownHandler);
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

		var iterator = {
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

		return iterator;
	},

	/**
	 * Returns the block at a given row and column in the BlockGrid.
	 * @param row {number} The row index to get
	 * @param col {number} The col index to get
	 * @returns {*} The Block object at (row, col) or undefined if no Block exists at the specified row and column
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

		// Add this block to the list of all blocks in the BlockGrid. It is important that this occur after
		// BlockGrid#_updateDimensions because BlockGrid#_updateDimensions uses BlockGrid#_blocksList to determine
		// which blocks to translate. We don't want BlockGrid#_updateDimensions to see the new block, because this
		// messes with its calculation of how much to translate the BlockGrid#_renderContainer by.
		this._blocksList.push(block);

		// Now that we know it is OK to add the block, we should set the reference at each grid location to be a
		// reference to the provided block.
		this._setBlock(block);

		// Keep track of this block in the dictionary of lists that keeps a separate list of blocks by classId
		this._addToBlocksByType(block);

		// Check if we need to change the category of this object so that it is not considered for being attracted
		// into the player's ship.
		this._checkSmallAsteroidCategory();

		// Add fixtures to update the server's physics model.
		this._addFixtures(block, updated);

		this._numBlocks++;

		return true;
	},

	/**
	 * Removes the block at the specified row and column from the grid.
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
				.fromBlockTypeMatrix([[block.classId()]])
				.translateTo(finalX, finalY, 0)
				.rotate().z(theta)
				.streamMode(1);

			// TODO: Compute correct velocities for new bodies, if needed

			// TODO: Split BlockGrids and make 1x1 asteroids smallAsteroids so
			// they get attracted

			// TODO: Implement flood fill algorithm to disconnect disjoint bodies from each other.
		}

		this._numBlocks--;

		block.destroy();
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
	 * @param blockTypeMatrix {Array} An array of arrays that holds classId's for Block objects. undefined is used to
	 * indicate that a space in the blockTypeMatrix does not include a Block. The blockTypeMatrix must be a rectangular
	 * matrix (every row has the same number of columns and every column has the same number of rows, but the total number
	 * of rows and total number of columns is not required to be the same).
	 * @returns {BlockGrid} Return this object to make function chaining convenient.
	 * @memberof BlockGrid
	 * @instance
	 */
	fromBlockTypeMatrix: function(blockTypeMatrix, checkForNeighbors) {
		// Remove all existing blocks from this grid and start fresh!
		this._removeAll();


		for (var row = 0; row < blockTypeMatrix.length; row++) {
			for (var col = 0; col < blockTypeMatrix[row].length; col++) {
				// The add() function knows how to deal with receiving undefined
				this.add(row, col, Block.prototype.blockFromClassId(blockTypeMatrix[row][col]), checkForNeighbors);
			}
		}

		return this;
	},

	/**
	 * Takes this BlockGrid and converts it to a matrix of class ID's, where each class ID represents a single type of block
	 * in the BlockGrid.
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
	 * @return {BlockGrid} Return this object to make function chaining convenient.
	 * @memberof BlockGrid
	 * @instance
	 */
	fromBlockMatrix: function(blockMatrix, checkForNeighbors) {
		// Remove all existing blocks from this grid and start fresh!
		this._removeAll();

		for (var row = 0; row < blockMatrix.length; row++) {
			for (var col = 0; col < blockMatrix[row].length; col++) {
				this.add(row, col, blockMatrix[row][col], checkForNeighbors);
			}
		}

		return this;
	},

	toString: function() {
		return this.toBlockTypeMatrix();
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
			console.log("Cannot add because the proposed addition overlaps with an occupied block."
				+ " row: " + row
				+ ", col: " + col
				+ ", block: " + block.classId()
			);
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
		var blockNumRows = block.numRows();
		var blockNumCols = block.numCols();

		// Check top and bottom boundaries
		var startCol = col;
		var topRow = row - 1;
		var bottomRow = row + blockNumRows;

		for (var x = 0; x < blockNumCols; x++) {
			if (this._isOccupied(topRow, startCol + x) || this._isOccupied(bottomRow, startCol + x)) {
				return true;
			}
		}

		// Check left and right boundary
		var startRow = row;
		var leftCol = col - 1;
		var rightCol = col + blockNumCols;

		for (var y = 0; y < blockNumRows; y++) {
			if (this._isOccupied(startRow + y, leftCol) || this._isOccupied(startRow + y, rightCol)) {
				return true;
			}
		}

		return false;
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
		if (index !== -1) {
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
	 * Adds a Box2D fixture to the physics model on the server for this {@link Block}. Updates all of the other
	 * fixtures in this {@link BlockGrid} if necessary.
	 * @param block {Block} The {@link Block} that we are adding a fixture for. The {@link Block} should have its row
	 * and column properties set already.
	 * @param updated {boolean} Whether or not the number of rows or number of columns has changed with the addition
	 * of the new block.
	 * @memberof BlockGrid
	 * @private
	 * @instance
	 */
	_addFixtures: function(block, updated) {
		// The physics model is only run on the server.
		if (!ige.isServer) {
			return;
		}

		// If the dimensions haven't changed, then we just need to add a fixture for the block we were given
		if (!updated) {
			this._addFixture(block);
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
		var x = Block.WIDTH * (block.col() - this.startCol()) - this._bounds2d.x2 + block._bounds2d.x2;
		var y = Block.HEIGHT * (block.row() - this.startRow()) - this._bounds2d.y2 + block._bounds2d.y2;
		return {
			density: BlockGrid.BLOCK_FIXTURE_DENSITY,
			friction: BlockGrid.BLOCK_FIXTURE_FRICTION,
			restitution: BlockGrid.BLOCK_FIXTURE_RESTITUTION,
			shape: {
				type: 'rectangle',
				data: {
					// The position of the fixture relative to the body
					// The fixtures are slightly smaller than the actual block grid so that you can fit into a whole which is exactly the same width (in terms of blocks) as your ship
					x: x + BlockGrid.BLOCK_FIXTURE_PADDING,
					y: y + BlockGrid.BLOCK_FIXTURE_PADDING,
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

	_removeFromGridRange: function(row, col, block) {
		
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
			}
		}

		// Translate this entity so that each block appears to be in the same position as it was before.
		// This needs to be the BlockGrid itself, not the _renderContainer, because translating the _renderContainer
		// will just move the _renderContainer within the BlockGrid, which will create strange calculation issues.
		this.translateBy(-translationData.x, -translationData.y, 0);

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
		var x = Block.WIDTH * (block.col() - this.startCol()) - this._bounds2d.x2 + block._bounds2d.x2;
		var y = Block.HEIGHT * (block.row() - this.startRow()) - this._bounds2d.y2 + block._bounds2d.y2;

		return {x: x - oldX, y: y - oldY};
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
		var x = Block.WIDTH * (block.col() - this.startCol()) - this._bounds2d.x2 + block._bounds2d.x2;
		var y = Block.HEIGHT * (block.row() - this.startRow()) - this._bounds2d.y2 + block._bounds2d.y2;

		block.translateTo(x, y, 0)

		return {x: x - oldX, y: y - oldY};
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

		console.log("World coordinates: ");
		console.log("worldX: " + worldX);
		console.log("worldY: " + worldY);

		// The coordinates of the center of the axis-aligned bounding box of the render container in
		// world coordinates
		var aabb = this.aabb();
		var aabbX = aabb.x + aabb.width / 2;
		var aabbY = aabb.y + aabb.height / 2;

		console.log("AABB coordinates:");
		console.log("aabbX: " + aabbX);
		console.log("aabbY: " + aabbY);

		// Translate the mouse position to a reference system where the center of the axis-aligned
		// bounding box is the center
		var aabbRelativeX = worldX - aabbX;
		var aabbRelativeY = worldY - aabbY;

		console.log("AABB relative coordinates: ");
		console.log("aabbRelativeX: " + aabbRelativeX);
		console.log("aabbRelativeY: " + aabbRelativeY);

		// This is the BlockGrid's rotation, not the render container's, since the render container does
		// not rotate with respect to its parent.
		// Negative because we want to reverse the rotation.
		var theta = -this._rotate.z;

		console.log("theta: " + theta);

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

		var row = Math.floor(gridY / Block.HEIGHT);
		var col = Math.floor(gridX / Block.WIDTH);

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
		if (this.get(row + 1, col) == undefined ||
			this.get(row - 1, col) == undefined ||
			this.get(row, col + 1) == undefined ||
			this.get(row, col - 1) == undefined) {
			console.log("Block has neighbors. Propagating click event!");
			block.mouseDown(event, control);
		}
	},

	streamCreateData: function() {
		return this.toBlockTypeMatrix();
	},

	// TODO: Use non padded method
	padding: function(val) {
		this._padding = val;
		return this;
	},

	// Created on server, streamed to all clients
	addMiningParticles: function(blockGridId, row, col) {
		var block = ige.$(blockGridId).get(row, col);
		// Calculate where to put our effect mount
		// with respect to the BlockGrid
		var x = Block.WIDTH * col -
						this._bounds2d.x2 + block._bounds2d.x2;
		var y = Block.HEIGHT * row -
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
				var block = self.get(data.row, data.col);
				if (block === undefined) {
					console.log("Request to mine undefined block. row: " + data.row + ", col: " + data.col);
					return false;
				}
				// Blocks should only be mined by one player, for now. Note that there is a race condition here.
				if((block === undefined) || block.busy()) {
					console.log("Request to mine undefined or busy block. row: " + data.row + ", col: " + data.col);
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
				}, Block.prototype.MINING_TIME);
				return true;

			case 'add':
				// Add block server side, then send add msg to client
				if(!self.add(data.row, data.col, Block.prototype.blockFromClassId(data.selectedType))) {
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
				//this._constructionZoneOverlay.refresh();
				break;
			case 'damage':
				var block = this.get(data.row, data.col);
				block.damage(data.amount);
				break;
			case 'add':
				ige.client.metrics.fireEvent(
					'construct',
					'existing',
					Block.prototype.blockFromClassId(data.selectedType)
				);
				this.add(data.row, data.col, Block.prototype.blockFromClassId(data.selectedType));
				this._renderContainer.refresh();
				this._constructionZoneOverlay.refresh();
				break;
			default:
				this.log('Cannot process block action ' + data.action + ' because no such action exists.', 'warning');
		}
	},

	/**
	 * Getter/setter for the grid property of the BlockGrid. If a parameter is passed, sets
	 * the property and returns this. If not, returns the property.
	 * @parameter grid the grid to set (optional)
	 * @return this if we set the grid or the current grid otherwise
	 */
	/*grid: function(grid) {
		if (grid === undefined) {
			return this._grid;
		}

		// TODO: Get rid of padding and use expanding BlockGrids
		this._grid = BlockGridPadding.padGrid(grid, this._padding);
		var maxRowLength = this._grid.get2DMaxRowLength();

		this.height(Block.HEIGHT * this._grid.length);
		this.width(Block.WIDTH * maxRowLength);



		for(var row = 0; row < this._grid.length; row++)
		{
			var blockList = this._grid[row];
			for(var col = 0; col < blockList.length; col++)
			{
				var block = blockList[col];

				if (block === undefined) {
					continue;
				}

				this._addFixture(this._box2dBody, block, row, col);
			}
		}

		return this;
	},*/

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
				console.log("Attraction detected.");
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

BlockGrid.BLOCK_FIXTURE_DENSITY = 1.0;
BlockGrid.BLOCK_FIXTURE_FRICTION = 0.5;
BlockGrid.BLOCK_FIXTURE_RESTITUTION = 0.5;
BlockGrid.BLOCK_FIXTURE_PADDING = .1;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGrid; }
