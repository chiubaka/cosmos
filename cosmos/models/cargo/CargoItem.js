/**
 * CargoItem.js
 * @author Derrick Liu
 * 
 * The CargoItem class represents the type of a block to insert into the cargo inventory.
 * 
 * The base CargoItem is intended to provide a common interface for other Cargo interfaces
 * to build upon in a way that extends the player's cargo inventory functionality.
 */
var CargoItem = IgeClass.extend({
	classId: 'CargoItem',

	/**
	 * If this CargoItem represents a whole block, this represents the block that is contained within.
	 * 
	 * May require refactoring of the Block model or adding a new model to represent a block so it doesn't contain world-specific info.
	 */
	_type: undefined,

	/**
	 * Initializes this CargoItem with a provided block. 
	 * 
	 * Generates a UUID for this CargoItem object and initializes the last modified timestamp.
	 * 
	 * @param block the block this item should represent
	 */
    init: function(blockType) {
	    this._type = blockType;
    },

	/**
	 * Gets the type of the entity represented by this CargoItem
	 */
	type: function() {
		return this._type;
	},
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoItem;
}