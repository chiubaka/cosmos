/**
 * Cosmos game constants should be stored in this central location
 */
var Constants = {

	visibleArea: {
		MAXIMUM_WIDTH: 1920,
		MAXIMUM_HEIGHT: 1200
	},

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Constants; }
