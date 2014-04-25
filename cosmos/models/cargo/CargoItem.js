var CargoItem = IgeClass.extend({
    classId: 'CargoItem',

	/**
	 * If this CargoItem represents a whole block, this represents the block that is contained within.
	 * 
	 * May require refactoring of the Block model or adding a new model to represent a block so it doesn't contain world-specific info.
	 */
    _entity: undefined,
	_type: undefined,
	_id: undefined,

    init: function(item) {
    	this._id = UuidGenerator.gen();
    	this._entity = JSON.parse(JSON.stringify(item));
	    this._type = this._entity.classId;
    },

	/**
	 * Generates a UUID to distinguish this cargo item from all other cargo items.
	 */
	uuid: function() {
		return this._id;
	},
});
