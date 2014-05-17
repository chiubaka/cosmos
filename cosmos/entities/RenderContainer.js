var RenderContainer = IgeEntity.extend({
	classId: 'RenderContainer',

	init: function () {
		IgeEntity.prototype.init.call(this);
		this.manualUpdate(true);
		this.compositeCache(true);
	},

	refresh: function () {
		this.manualUpdateNeeded(true);
		this.cacheDirty(true);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RenderContainer; }
