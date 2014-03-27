var BlockGridRenderContainer = IgeEntity.extend({
	classId: 'BlockGridRenderContainer',

	init: function() {
		IgeEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.compositeCache(true);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = BlockGridRenderContainer; }
