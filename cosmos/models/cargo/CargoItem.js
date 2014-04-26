/**
 * CargoItem.js
 * @author Derrick Liu
 * 
 * The CargoItem class represents a single item in a player's cargo inventory.
 * This item contains a reference to the CargoContainer that contains it.
 */
var CargoItem = IgeClass.extend({
    classId: 'CargoItem',

	/**
	 * If this CargoItem represents a whole block, this represents the block that is contained within.
	 * 
	 * May require refactoring of the Block model or adding a new model to represent a block so it doesn't contain world-specific info.
	 */
	_id: undefined,
	_entity: undefined,
	_container: undefined,

	_lastModified: undefined,

    init: function(block) {
    	this._id = UuidGenerator.gen();
    	this._entity = JSON.parse(JSON.stringify(block));
    	this._container = container;

	    this.updateLastModified();
    },

	updateLastModified: function() {
		this._lastModified = Date.now();
	},

	container: function(container) {
		if (container !== undefined) {
			this._container = container;
			this.updateLastModified();
			return this;
		}

		return this._container;
	},

	type: function() {
		return this._entity.classId;
	},

	/**
	 * A UUID to distinguish this cargo item from all other cargo items.
	 */
	uuid: function() {
		return this._id;
	},
});
