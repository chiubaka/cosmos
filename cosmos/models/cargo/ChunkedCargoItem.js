var ChunkedCargoItem = IgeClass.extend({
	classId: 'ChunkedCargoItem',

	/**
	 * Whether or not this CargoItem is a chunk placeholder in the player's cargo inventory that contains
	 * a certain number of chunks.
	 * 
	 * The limit of the number of chunks is set by the Cargo model.
	 */
	_isChunkBlock: false,

	/**
	 * If this CargoItem is a chunk block, contains the chunks that are contained in the placeholder.
	 * 
	 * All chunks are moved as a single entity.
	 */
	_chunks: [],

	init: function(item) {
		throw "Not implemented!";
	}
});