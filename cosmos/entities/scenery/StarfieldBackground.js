/**
 * A {@link ParallaxBackground} which represents the starfield background of the
 * game. This is in front of the nebula background.
 * @class
 * @typedef {StarfieldBackground}
 * @namespace
 */
var StarfieldBackground = ParallaxBackground.extend({
	classId: 'StarfieldBackground',

	init: function () {
		ParallaxBackground.prototype.init.call(this);

		if (!ige.isServer) {
			this.texture(ige.client.textures.background_starfield)
				.width(6000)
				.height(6000)
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = StarfieldBackground; }
