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

			// Create a 3x3 tiled grid, translated so the grid's (1,1) is at
			// IGE location (0,0)
			this.starTiles = new IgeTileMap2d()
				.id('star_tiles')
				.gridSize(3,3)
				.tileWidth(6000)
				.tileHeight(6000)
				.translateTo(-9000, -9000, 0)
				.mount(this);

			// Fill the tiled grid with stars
			for (var x = 0; x < 3; x++) {
				for (var y = 0; y < 3; y++) {
					new IgeEntity()
						.mount(this.starTiles)
						.widthByTile(1)
						.heightByTile(1)
						.texture(ige.client.textures.background_starfield)
						.translateToTile(x, y, 0)
				}
			}
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = StarfieldBackground; }
