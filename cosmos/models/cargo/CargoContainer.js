var CargoContainer = IgeClass.extend({
	classId: 'CargoContainer',

	_block: undefined,
	_itemStore: undefined,
	_capacity: 1,

	init: function(capacity) {
		this._itemStore = {};
		this._capacity = capacity;
	},
	
	addItem: function(item) {
		if (!this.hasSpace()) {
			throw "No more space in this cargo container!";
		}

		this._itemStore[uuid] = item;
		return item.uuid();
	},

	hasItem: function(itemId) {
		return this._itemStore.hasOwnProperty(itemId);
	},
	
	getItems: function(itemId) {
		return this._itemStore[itemId];
	},
	
	capacity: function() {
		return this._capacity;
	},
	
	numItems: function() {
		return this._itemStore.length;
	},
	
	hasSpace: function() {
		return ((this.capacity() - this.numItems()) > 0);
	}
});
