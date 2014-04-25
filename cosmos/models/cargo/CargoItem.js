var CargoItem = IgeClass.extend({
    classId: 'CargoItem',

	/**
	 * If this CargoItem represents a whole block, this represents the block that is contained within.
	 * 
	 * May require refactoring of the Block model or adding a new model to represent a block so it doesn't contain world-specific info.
	 */
	_id: undefined,
	_entity: undefined,
	_type: undefined,
	_container: undefined,

	_lastModified: undefined,

    init: function(block) {
    	this._id = UuidGenerator.gen();
    	this._entity = JSON.parse(JSON.stringify(block));
    	this._type = this._entity.classId;
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

	/**
	 * Generates a UUID to distinguish this cargo item from all other cargo items.
	 */
	uuid: function() {
		return this._id;
	},
});
