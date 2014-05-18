var RenderContainer = IgeEntity.extend({
	classId: 'RenderContainer',

	init: function () {
		IgeEntity.prototype.init.call(this);
		this.updateChildren(true);
		this.compositeCache(true);
	},

	refresh: function () {
		this.updateChildrenNeeded(true);
		this.cacheDirty(true);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RenderContainer; }
