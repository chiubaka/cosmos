var EffectsMount = IgeEntity.extend({
	classId: 'EffectsMount',

	init: function() {
		IgeEntity.prototype.init.call(this);
		if (!ige.isServer) {
			// This puts the effects animations in the foreground relative to the
			// BlockGrids
			this.depth(1);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = EffectsMount; }
