var CargoContainer = IgeClass.extend({
	classId: 'CargoContainer',

	_itemStore: undefined,
	_capacity: 1,

	init: function(capacity) {
		this._itemStore = [];
		this._capacity = capacity;
	},

	linkItem: function(item) {
		if (!this.hasSpace()) {
			throw "No more space in this cargo container!";
		}

		this._itemStore.push(item);
		return item.uuid();
	},

	unlinkItem: function(itemId) {
		throw "Not implemented";
	},

	hasItem: function(itemId) {
		for (var item in this._itemStore) {
			if (item.uuid() === itemId) {
				return true;
			}
		}
	},

	getItem: function(itemId) {
		for (var item in this._itemStore) {
			if (item.uuid() === itemId) {
				return item;
			}
		}
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
