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
		if (ige.isClient) {
			this.backgroundTexture = PIXI.TextureCache.background_starfield;
			this.backgroundHeight = this.backgroundWidth = 6000;
		}

		ParallaxBackground.prototype.init.call(this);

		if (ige.isClient) {
			this.texture(ige.client.textures.background_starfield)
				.width(6000)
				.height(6000)
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = StarfieldBackground; }
