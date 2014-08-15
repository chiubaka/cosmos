/**
 * Cosmos game constants should be stored in this central location
 */
var Constants = {
	fps: {
		CLIENT_FPS: 30,
		SERVER_FPS: 20
	},

	visibleArea: {
		MAXIMUM_WIDTH: 1920,
		MAXIMUM_HEIGHT: 1200
	},

	minimapArea: {
		MAXIMUM_WIDTH: 1920 * 2,
		MAXIMUM_HEIGHT: 1200 * 2
	},

	//constant properties of the background tiles
	GRID_SQUARE_SIZE: {
		X: 1024,
		Y: 1024
	},

	NUM_GRID_SQUARES: {
		X: 7,
		Y: 7
	},

	//this is a constant offset that we apply to the whole background
	BACKGROUND_OFFSET: {
		X: -3000,
		Y: -3000
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Constants; }
