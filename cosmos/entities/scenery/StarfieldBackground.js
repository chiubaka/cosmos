/**
 * A {@link ParallaxEntity} which represents the background of the game.
 * @class
 * @typedef {StarfieldBackground}
 * @namespace
 */
var StarfieldBackground = ParallaxEntity.extend({
	classId: 'StarfieldBackground',

	init: function () {
		ParallaxEntity.prototype.init.call(this);

		if (!ige.isServer) {
			this.texture(ige.client.textures.background_starfield)
				.width(6000 * 2)
				.height(6000 * 2);
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = StarfieldBackground; }
