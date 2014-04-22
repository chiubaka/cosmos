var CargoItem = IgeClass.extend({
    classId: 'CargoItem',
    
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
    
	/**
	 * If this CargoItem represents a whole block, this represents the block that is contained within.
	 * 
	 * May require refactoring of the Block model or adding a new model to represent a block so it doesn't contain world-specific info.
	 */
    _entity: undefined,

    init: function() {
	    throw "Not implemented!";
    }
});
