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
			this.backgroundTexture = PIXI.TextureCache.background_starfield;
			this.backgroundHeight = this.backgroundWidth = 6000;
		}

		ParallaxBackground.prototype.init.call(this);

		console.log("This is the Background class being init!");
		console.log('background' + this.gridX + '-' + this.gridY);

		if (ige.isClient) {
			console.log(ige.client.textures['background' + this.gridX + '-' + this.gridY]);
			console.log(ige.client.textures);
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
