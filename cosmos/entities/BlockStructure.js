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

	init: function(data) {
		BlockGrid.prototype.init.call(this, data);

		this._enableRefresh = true;

		if (ige.isClient) {
			this._constructionOverlay = new ConstructionOverlay(this)
				.mount(this);
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
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = BlockStructure;
}
