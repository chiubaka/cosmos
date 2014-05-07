var RenderContainer = IgeEntity.extend({
	classId: 'RenderContainer',

	_blockGrid: undefined,

	init: function () {
		IgeEntity.prototype.init.call(this);
		this.compositeCache(true);
	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = RenderContainer; }
