/**
 * A {@link ParallaxBackground} which represents the nebula background of the game.
 * @class
 * @typedef {Background}
 * @namespace
 */
var Background = ParallaxBackground.extend({
	classId: 'Background',

	textureName: undefined,

	init: function (data) {
		if (data.texture !== undefined) {
			this.textureName = data.textureName;
		}

		if (ige.isClient) {
			this.backgroundTexture = PIXI.TextureCache[data.textureName];
			this.backgroundHeight = this.backgroundWidth = 1024;//TODO use the constant for this
		}

		ParallaxBackground.prototype.init.call(this);

		if (ige.isClient) {
			this
				.texture(ige.client.textures[data.textureName])
				.width(1024)
				.height(1024);
		}
	},

	streamCreateData: function() {
		var data = ParallaxBackground.prototype.streamCreateData.call(this);

		data.textureName = this.textureName;

		return data;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Background; }
