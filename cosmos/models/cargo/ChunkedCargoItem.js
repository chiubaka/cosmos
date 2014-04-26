/**
 * ChunkedCargoItem.js
 * @author Derrick Liu
 * 
 * WIP: An example of extending CargoItems to serve as chunk containers.
 * 
 * Chunks are the drops that result from mining asteroids and ore. Chunks
 * represent the viable material that is collected from the mining process.
 * After a certain number of mined chunks are collected, these chunk containers
 * could be coalesced into whole blocks of a particular element.
 */
var ChunkedCargoItem = CargoItem.extend({
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
		this._chunks = [];
		CargoItem.prototype.init.call(this, item);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = ChunkedCargoItem;
}