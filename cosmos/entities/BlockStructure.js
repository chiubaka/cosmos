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
	 * @type {ConstructionOverlay}
	 * @memberof BlockStructure
	 * @private
	 * @instance
	 */
	_constructionOverlay: undefined,
	/**
	 * Controls whether or not the Construction Overlay should be refreshed.
	 */
	_enableRefresh: undefined,
	/**
	 * Controls whether or not Construction Overlay is refreshed during streamSectionData.
	 */
	_needsRefresh: undefined,

	init: function(data) {
		data = data || {};

		if (ige.isServer) {
			data.physicsBody = data.physicsBody || {};

			// These are default values for the category and mask of a BlockStructure.
			// Subclasses can override these by setting their own.
			data.physicsBody.fixtureFilter = data.physicsBody.fixtureFilter || {
				categoryBits: data.physicsBody.categoryBits
					|| BlockStructure.BOX2D_CATEGORY_BITS,
				maskBits: data.physicsBody.maskBits
					|| (0xffff & ~(1 << Drop.BOX2D_CATEGORY_BITS))
			}
		}

		BlockGrid.prototype.init.call(this, data);

		this._enableRefresh = true;

		if (ige.isClient) {
			this._constructionOverlay = new ConstructionOverlay(this)
				.mount(this);
		}
	},

	processActionClient: function(data) {
		if (data.action === "remove" || data.action === "put") {
			this._needsRefresh = true;
		}

		BlockGrid.prototype.processActionClient.call(this, data);
	},

	put: function(block, location, replace) {
		var refresh = this._enableRefresh;
		this._enableRefresh = false;
		var result = BlockGrid.prototype.put.call(this, block, location, replace);
		this._enableRefresh = refresh;

		this._refreshConstructionOverlay();
		return result;
	},

	remove: function(location, width, height) {
		var result = BlockGrid.prototype.remove.call(this, location, width, height);

		this._refreshConstructionOverlay();

		return result;
	},

	streamSectionData: function(sectionId, data, bypassTimeStream) {
		if (data) {
			if (sectionId === "actions") {
				var refresh = this._enableRefresh;
				this._enableRefresh = false;

				// Reset this to false before the BlockGrid processes all of the packets.
				this._needsRefresh = false;
				BlockGrid.prototype.streamSectionData.call(this, sectionId, data, bypassTimeStream);
				this._enableRefresh = refresh;

				// If after processing all of the packets, needsRefresh has been set to true, then
				// an add or remove has occurred, so we must refresh the overlay.
				if (this._needsRefresh) {
					this._refreshConstructionOverlay();
				}
			}
			else {
				BlockGrid.prototype.streamSectionData.call(this, sectionId, data, bypassTimeStream);
			}
		}
		else {
			return BlockGrid.prototype.streamSectionData.call(this, sectionId, data,
				bypassTimeStream);
		}


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
		block.mouseDown(event, control);
	},

	_refreshConstructionOverlay: function() {
		if (ige.isClient && this._constructionOverlay && this._enableRefresh) {
			this._constructionOverlay.refresh();
		}
	}
});

BlockStructure.BOX2D_CATEGORY_BITS = 0x0008;


if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = BlockStructure;
}
