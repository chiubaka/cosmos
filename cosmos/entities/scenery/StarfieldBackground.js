/**
 * A {@link ParallaxBackground} which represents the starfield background of the
 * game. This is in front of the nebula background.
 * @class
 * @typedef {StarfieldBackground}
 * @namespace
 */
var StarfieldBackground = ParallaxBackground.extend({
	classId: 'StarfieldBackground',
	/**
	 * TiledMap of starfield entities.
	 * @type {IgeTileMap2d}
	 * @memberof StarfieldBackground
	 * @private
	 * @instance
	 */
	_starTiles: undefined,

	init: function () {
		ParallaxBackground.prototype.init.call(this);

		if (!ige.isServer) {

			// Create a 3x3 tiled grid to make it easier to tile the background
			// The grid is translated so the grid's (1,1) is at IGE location (0,0).
			this._starTiles = new IgeTileMap2d()
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
						.mount(this._starTiles)
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
