/**
 * A {@link ParallaxBackground} which represents the nebula background of the game.
 * @class
 * @typedef {Background}
 * @namespace
 */
var Background = ParallaxBackground.extend({
	classId: 'Background',

	init: function () {
		if (ige.isClient) {

			this.backgroundTexture = PIXI.TextureCache.background_helix_nebula;
			this.backgroundWidth = 6145;
			this.backgroundHeight = 6623;
			//this should make the background pattern repeat. I haven't gotten this to work yet.
			//this.backgroundPattern(ige.client.textures.background_helix_nebula, 'repeat', true, false);
		}

		ParallaxBackground.prototype.init.call(this);

		if (ige.isClient) {
			this.texture(ige.client.textures.background_helix_nebula)
				.width(6145)
				.height(6623);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Background; }
