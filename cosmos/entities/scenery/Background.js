/**
 * A {@link ParallaxBackground} which represents the nebula background of the game.
 * @class
 * @typedef {Background}
 * @namespace
 */
var Background = ParallaxBackground.extend({
	classId: 'Background',

	init: function () {
		ParallaxBackground.prototype.init.call(this);

		if (!ige.isServer) {

			//this should make the background pattern repeat. I haven't gotten this to work yet.
			//this.backgroundPattern(ige.client.textures.background_helix_nebula, 'repeat', true, false);

			this.texture(ige.client.textures.background_helix_nebula)
				.width(6145)
				.height(6623);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Background; }
