/**
 * A {@link ParallaxBackground} which represents the nebula background of the game.
 * @class
 * @typedef {Background}
 * @namespace
 */
var Background = ParallaxBackground.extend({
	classId: 'Background',

	gridX: undefined,

	gridY: undefined,

	init: function (data) {
		if (data.gridX !== undefined) {
			this.gridX = data.gridX;
		}

		if (data.gridY !== undefined) {
			this.gridY = data.gridY;
		}

		if (ige.isClient) {
			this.backgroundTexture = PIXI.TextureCache['background' + this.gridX + '-' + this.gridY];
			this.backgroundHeight = this.backgroundWidth = 1024;
		}

		ParallaxBackground.prototype.init.call(this);

		if (ige.isClient) {
			this
				.texture(ige.client.textures['background' + this.gridX + '-' + this.gridY])
				//.texture(ige.client.textures.background_starfield)
				.width(1024)
				.height(1024);
		}
	},

	streamCreateData: function() {
		var data = ParallaxBackground.prototype.streamCreateData.call(this);

		data.gridX = this.gridX;
		data.gridY = this.gridY;

		return data;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = Background; }
