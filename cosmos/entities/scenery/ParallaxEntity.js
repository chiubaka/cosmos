var ParallaxEntity = IgeEntity.extend({
	classId: "ParallaxEntity",
	init: function() {
		IgeEntity.prototype.init.call(this),
		this._parallaxLag = 1
	},

	parallaxLag: function(t) {
			return t === void 0 || 0 > t ? void 0 : (this._parallaxLag = t, this)
	},

	update: function(ctx) {
			var e = ige._currentCamera;
			this.translateTo(e._translate.x / this._parallaxLag, e._translate.y / this._parallaxLag, e._translate.z / this._parallaxLag);
			this.scaleTo(1 / e._scale.x, 1 / e._scale.y, 1 / e._scale.z);
			this.rotateTo(-e._rotate.x, -e._rotate.y, -e._rotate.z);
			IgeEntity.prototype.update.call(this, ctx);
	},

	tick: function(ctx) {
		IgeEntity.prototype.tick.call(this, ctx);
	}
});
if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ParallaxEntity; }
