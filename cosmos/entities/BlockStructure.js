/**
 * The BlockStructure extends the {@link BlockGrid} to provide functionality (like mining and constructing) for
 * structures made out of blocks in the game (e.g. ships, asteroids, etc.).
 * It is necessary that this functionality be separated out from the {@link BlockGrid} because the {@link BlockGrid}
 * is meant to act as just a data structure and nothing else.
 * @class
 * @typedef {BlockGrid} BlockStructure
 * @namespace
 */
var BlockStructure = BlockGrid.extend({
	classId: 'BlockStructure',

	/**
	 * Construction zone overlay for showing and hiding locations that players can click on in order to place a block
	 * on an existing structure.
	 * @type {ConstructionZoneOverlay}
	 * @memberof BlockStructure
	 * @private
	 * @instance
	 */
	_constructionZoneOverlay: undefined,

	init: function(data) {
		BlockGrid.prototype.init.call(this, data);

		if (!ige.isServer) {
			// TODO: Lazily create when needed to speed up load time.
			// TODO: Examine ConstructionZoneOverlay to make sure it is compatible with new BlockGrid backing.
			// TODO: Uncomment this. Commented out so I can test the new BlockGrid class without getting errors from
			// the ConstructionZoneOverlay class.
			this._constructionZoneOverlay = new ConstructionZoneOverlay(this)
				.mount(this);
		}
	},

	/**
	 * Creates a list of all locations around this {@link BlockGrid} where a new {@link Block} could be placed.
	 * @returns {Array} A list of all locations around this {@link BlockGrid} where a new {@link Block} can be placed.
	 * Location objects are in the format {row: number, col: number}.
	 * @memberof BlockStructure
	 * @instance
	 * @todo Modify this to support taking a block size and returning only the locations that can support a block of
	 * that size
	 */
	constructionZoneLocations: function() {
		var constructionZoneLocations = [];
		var iterator = this.iterator();
		while (iterator.hasNext()) {
			var block = iterator.next();
			// Fancy way of concatenating two arrays. Referenced from here:
			// http://stackoverflow.com/questions/4156101/javascript-push-array-values-into-another-array
			constructionZoneLocations.push.apply(constructionZoneLocations, this._emptyNeighboringLocations(block));
		}
		return constructionZoneLocations;
	},

	/**
	 * Overrides {@link BlockGrid#_blockClickHandler}. Does logical checks to make sure that a {@link Block} can be
	 * clicked before passing the click event down to the {@link Block} itself.
	 * @param block {Block} The {@link Block} that has been clicked.
	 * @param event {Object} The event data about the click. SHOULD NOT BE TRUSTED FOR POSITIONAL DATA because the
	 * {@link BlockGrid} does not update these before passing them down.
	 * @param control {Object} The control object associated with the click.
	 * @memberof BlockStructure
	 * @private
	 * @instance
	 * @todo Don't make the assumption that mouseDown on a {@link BlockStructure} means mining a {@link Block}.
	 */
	_blockClickHandler: function(block, event, control) {
		// TODO: This might be dangerous, since some of the event properties should be changed so that they are
		// relative to the child's bounding box, but since we don't use any of those properties for the moment,
		// ignore that.
		if (this._hasNeighboringOpenLocations(block.row(), block.col(), block)) {
			block.mouseDown(event, control);
		}
	},

	/**
	 * Extends the {@link BlockGrid#processBlockActionServer} function to provide additional functionality for
	 * structure-specific actions. Process actions server-side.
	 * @param data {Object} An object representing the action sent from the client.
	 * @param player {Player} The player that triggered the block action.
	 * @returns {boolean} True if the action was successfully processed. False otherwise.
	 * @memberof BlockStructure
	 * @instance
	 */
	processBlockActionServer: function(data, player) {
		BlockGrid.prototype.processBlockActionServer.call(this, data, player);
		var self = this;

		switch (data.action) {
			case 'mine':
				var block = self.get(data.row, data.col);
				if (block === undefined) {
					console.log("Request to mine undefined block. row: " + data.row + ", col: " + data.col);
					return false;
				}
				// Blocks should only be mined by one player, for now. Note that there is a race condition here.
				if((block === undefined) || block.isBeingMined()) {
					console.log("Request to mine undefined or busy block. row: " + data.row + ", col: " + data.col);
					return false;
				}
				block.isBeingMined(true);

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

						player.mining = false;
						player.turnOffMiningLasers(block);

						// Drop block server side, then send drop msg to client
						self.drop(data.row, data.col, player);
						data.action = 'remove';
						ige.network.send('blockAction', data);
					}
				}, Block.MINING_INTERVAL / player.numBlocksOfType(MiningLaserBlock.prototype.classId()));
				return true;
			default:
				return false;
		}
	},

	/**
	 * Extends the {@link BlockGrid#processBlockActionClient} function to provide additional functionality for
	 * structure-specific actions. Process actions client-side.
	 * @param data {Object} An object representing the action sent from the server.
	 * @memberof BlockStructure
	 * @instance
	 */
	processBlockActionClient: function(data) {
		BlockGrid.prototype.processBlockActionClient.call(this, data);

		switch (data.action) {
			case 'remove':
				this._constructionZoneOverlay.refresh();
				break;
			case 'add':
				this._constructionZoneOverlay.refresh();
				break;
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockStructure; }