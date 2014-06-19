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
	 * @memberof BlockGrid
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

	_blockClickHandler: function(block, event, control) {
		// TODO: This might be dangerous, since some of the event properties should be changed so that they are
		// relative to the child's bounding box, but since we don't use any of those properties for the moment,
		// ignore that.
		if (this._hasNeighboringOpenLocations(block.row(), block.col(), block)) {
			block.mouseDown(event, control);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockStructure; }