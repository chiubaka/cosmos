var RenderContainer = IgeEntity.extend({
	classId: 'RenderContainer',

	init: function () {
		IgeEntity.prototype.init.call(this);
		this.compositeCache(true);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RenderContainer; }
