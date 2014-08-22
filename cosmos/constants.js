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

	NUM_BACKGROUND_SQUARES: {
		X: 7,
		Y: 7
	},

	//this is a constant offset that we apply to the whole background
	BACKGROUND_OFFSET: {
		X: -3000,
		Y: -3000
	},

	NUM_BACKGROUND_OVERLAY_SQUARES: {
		X: 8,
		Y: 8
	},

	GRID_SQUARE_OVERLAP: 1, // I think we only need a tiny overlap to get rid of the gaps in safari

	SECOND_OVERLAY_ROTATION: Math.PI / 4
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Constants; }
