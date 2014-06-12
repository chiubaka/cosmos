/**
 * CargoItemEntity.js
 * 
 * Don't use this yet, we haven't implemented support for it and it doesn't work.
 * @author Derrick Liu
 */
// var CargoItem = IgeClass.extend({
//     classId: 'CargoItem',

// 	/**
// 	 * If this CargoItem represents a whole block, this represents the block that is contained within.
// 	 * 
// 	 * May require refactoring of the Block model or adding a new model to represent a block so it doesn't contain world-specific info.
// 	 */
// 	_id: undefined,
// 	_entity: undefined,
// 	_container: undefined,

// 	_lastModified: undefined,

// 	/**
// 	 * Initializes this CargoItem with a provided block. 
// 	 * 
// 	 * Generates a UUID for this CargoItem object and initializes the last modified timestamp.
// 	 * 
// 	 * @param block the block this item should represent
// 	 */
//     init: function(block) {
//     	this._id = UuidGenerator.gen();
//     	this._entity = JSON.parse(JSON.stringify(block));

// 	    this.updateLastModified();
//     },

// 	/**
// 	 * Updates the time that this CargoItem object was last modified.
// 	 */
// 	updateLastModified: function() {
// 		this._lastModified = Date.now();
// 	},

// 	/**
// 	 * Gets or sets the container that this CargoItem is associated with.
// 	 * 
// 	 * Lets us associate CargoItems with specific CargoContainers, which will prove useful later
// 	 * when grouping items in certain physical cargo blocks.
// 	 * 
// 	 * @param container the CargoContainer that this item is associated with
// 	 */
// 	container: function(container) {
// 		if (container !== undefined) {
// 			this._container = container;
// 			this.updateLastModified();
// 			return this;
// 		}

// 		return this._container;
// 	},

// 	/**
// 	 * Gets the type of the entity represented by this CargoItem
// 	 */
// 	type: function() {
// 		return this._entity.classId;
// 	},

// 	/**
// 	 * A UUID to distinguish this cargo item from all other cargo items.
// 	 */
// 	uuid: function() {
// 		return this._id;
// 	},
// });

// if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
// 	module.exports = CargoItem;
// }