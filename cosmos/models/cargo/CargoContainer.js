/**
 * CargoContainer.js
 * @author Derrick Liu
 * 
 * The CargoContainer class represents a container owned by the player that holds some number
 * of CargoItems.
 * 
 * CargoContainers are used to enable others to extend functionality so individual cargo blocks
 * or groups of blocks on a player's ship can be arbitrarily defined and grouped as cargo
 * containers in the future.
 */
var CargoContainer = IgeClass.extend({
	classId: 'CargoContainer',

	_itemStore: undefined,
	_capacity: 1,

	/**
	 * Initialize a cargo container.
	 */
	init: function(capacity) {
		this._itemStore = [];
		this._capacity = capacity;
	},

	/**
	 * Links an item in the player's cargo inventory with this
	 * cargo container (i.e. "store" this cargo container the
	 * item)
	 */
	linkItem: function(item) {
		if (!this.hasSpace()) {
			throw "No more space in this cargo container!";
		}

		this._itemStore.push(item);
		return item.uuid();
	},

	/**
	 * Unlinks an item in the player's cargo inventory from this cargo
	 * container (i.e. the item is "removed" from this cargo container)
	 */
	unlinkItem: function(itemId) {
		var indexToRemove = -1;
		for (var i = 0; i < this._itemStore.length; i++) {
			if (this._itemStore[i].uuid() === itemId) {
				indexToRemove = i;
				break;
			}
		}

		if (indexToRemove >= 0) {
			ArrayUtils.remove(this._itemStore, indexToRemove);
		}
	},

	/**
	 * Whether or not the cargo container "contains" an item with a
	 * particular itemId
	 */
	hasItem: function(itemId) {
		for (var item in this._itemStore) {
			if (item.uuid() === itemId) {
				return true;
			}
		}
	},

	/**
	 * Get an item with a particular UUID that is contained in this
	 * cargo container.
	 */
	getItem: function(itemId) {
		for (var item in this._itemStore) {
			if (item.uuid() === itemId) {
				return item;
			}
		}
	},

	/**
	 * Gets the capacity of the cargo container.
	 */
	capacity: function() {
		return this._capacity;
	},

	/**
	 * Gets the number of CargoItems contained in this cargo container
	 */
	numItems: function() {
		return this._itemStore.length;
	},

	/**
	 * Whether or not more elements can be added to the cargo container
	 */
	hasSpace: function() {
		return ((this.capacity() - this.numItems()) > 0);
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoContainer;
}