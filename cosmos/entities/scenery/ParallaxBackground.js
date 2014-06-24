/**
 * Use the ParallaxBackground class for parallax effect in-game backgrounds.
 * @class
 * @typedef {Object} ParallaxBackground
 * @namespace
 */
var ParallaxBackground = IgeEntity.extend({
	classId: "ParallaxBackground",

	/**
	 * Magnitude of parallax lag.
	 * Low value: Background is static.
	 * Intermediate value (2-10): Background lags behind camera (typically what
	 * you want).
	 * High value: Background moves with camera.
	 * @type {number}
	 * @memberof ParallaxBackground
	 * @private
	 * @instance
	 */
	_parallaxLag: 1,

	init: function() {
		IgeEntity.prototype.init.call(this);
	},

	/**
	 * Getter/setter for the parallaxLag property.
	 * @param val {number} Optional parameter. If set, this is the new
	 * parallaxLag
	 * @returns {*} parallaxLag value if no parameter is passed or this object if a
	 * parameter is passed to make setter chaining convenient.
	 * @memberof ParallaxBackground
	 * @instance
	 */
	parallaxLag: function(val) {
		if (val !== undefined) {
			this._parallaxLag = val;
			return this;
		}
		return this._parallaxLag;
	},

	update: function(ctx) {
		var camera = ige._currentCamera;

		this.translateTo(
			camera._translate.x / this._parallaxLag,
			camera._translate.y / this._parallaxLag,
			camera._translate.z / this._parallaxLag);

		IgeEntity.prototype.update.call(this, ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ParallaxBackground; }
