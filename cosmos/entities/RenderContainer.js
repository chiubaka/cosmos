/**
 * An {@link IgeEntity} that serves as a caching layer for the rendering of the {@link Block}s that are part of a
 * larger construct like a {@link BlockGrid} or a {@link ConstructionZoneOverlay}.
 * @class
 * @typedef {RenderContainer}
 * @namespace
 */
var RenderContainer = IgeEntity.extend({
	classId: 'RenderContainer',

	init: function () {
		IgeEntity.prototype.init.call(this);
		//this.updateChildren(true);

		this.addComponent(PixiRenderableComponent);

		this.compositeCache(true);
	},

	/**
	 * Invalidates the cache and updates all children. This function must be called anytime a change is made to one of
	 * the {@link Block}s in a {@link BlockGrid} or the rendering will not update to reflect the change.
	 * @memberof RenderContainer
	 * @instance
	 */
	refresh: function () {
		//this.updateChildrenNeeded(true);
		this.cacheDirty(true);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RenderContainer; }
