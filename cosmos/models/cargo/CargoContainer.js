﻿/**
 * CargoContainer.js
 * @author Derrick Liu
 * 
 * The CargoContainer class represents a container owned by the player that holds some blocks.
 * 
 * The base CargoContainer is intended to provide a common interface for other CargoInterfaces
 * to build upon in a way that extends the player's cargo inventory functionality.
 */
var CargoContainer = IgeClass.extend({
	classId: 'CargoContainer',

	/**
	 * The number of "slots" that a single cargo container contains. A slot is a space
	 * in the cargo container that can hold a stack of items of a single type.
	 */
	DEFAULT_CONTAINER_SLOTS: 64,

	/**
	 * The maximum size of a stack of items of the same type that will fit in a slot. 
	 * Adding more items of the same type will require a new stack or a new container.
	 */
	STACK_SIZE: 60,

	/**
	 * The store used for this item container.
	 */
	_itemStore: undefined,

	/**
	 * The number of available slots in this container.
	 */
	_numSlots: 0,

	/**
	 * Initialize a cargo container.
	 * 
	 * @param numSlots the number of slots this container should have
	 * @param itemStore the intial itemStore (optional)
	 */
	init: function(numSlots, itemStore) {
		if (itemStore !== undefined) {
			this._itemStore = itemStore;
		} else {
			this._itemStore = {};
		}

		this._numSlots = this.DEFAULT_CONTAINER_SLOTS;
		if (numSlots !== undefined) {
			this._numSlots = numSlots;
		}
	},

	/**
	 * Add a particular CargoItem to this container.
	 * 
	 * @param the CargoItem to add
	 * @returns whether or not the add was successful
	 */
	addItem: function(item) {
		if (!this.hasSpace(item)) {
			return false;
		}

		if (!this._itemStore.hasOwnProperty(item.type())) {
			this._itemStore[item.type()] = 0;
		}

		this._itemStore[item.type()]++;
		return true;
	},

	/**
	 * Remove a number of items with a specific type from the container.
	 * 
	 * @param itemType the types of items to remove (given by classId)
	 * @param quantity the number of items to remove (upper bound)
	 * @returns the number of items removed
	 */
	removeType: function(itemType, quantity) {
		if (!this._itemStore.hasOwnProperty(itemType)) {
			return 0;
		}

		var numToRemove = Math.min(this._itemStore[itemType], quantity);
		this._itemStore[itemType] -= numToRemove;
		if (this._itemStore[itemType] <= 0) {
			delete this._itemStore[itemType];
		}

		return numToRemove;
	},

	/**
	 * Extracts a specific number of items from the container.
	 * This is similar to a withdrawal: the items will be removed from the container
	 * and returned to the caller.
	 * 
	 * @param itemType the item's type
	 * @returns a list of the items extracted
	 */
	extractType: function(itemType, quantity) {
		var extracted = [];

		if (!this._itemStore.hasOwnProperty(itemType)) {
			return extracted;
		}

		var numToExtract = Math.min(this._itemStore[itemType], quantity);
		this._itemStore[itemType] -= numToExtract;
		if (this._itemStore[itemType] <= 0) {
			delete this._itemStore[itemType];
		}

		for (var i = 0; i < numToExtract; i++) {
			extracted.push(Block.blockFromClassId(itemType));
		}

		return extracted;
	},

	/**
	 * Extracts a specific number of items from the container in a round robin fashion.
	 * 
	 * @param quantity the number of items to extract
	 * @returns a list of the items extracted
	 */
	rrExtractItems: function(quantity) {
		var extracted = [];
		var remaining = Math.min(quantity, this.numItems());
		while (remaining > 0) {
			for (var itemType in this._itemStore) {
				var extractedFromType = this.extractType(itemType, 1);
				extracted = extracted.concat(extractedFromType);
				remaining -= extractedFromType.length;
				if (remaining == 0) {
					break;
				}
			}
		}

		return extracted;
	},

	/**
	 * Gets the list of item types, and the number of items of each type.
	 * 
	 * TODO: Will change in the future when we implement being able to store more than one stack of each item in a cargo container.
	 * @returns a dictionary of item types and the number of items of each type.
	 */
	getItemList: function() {
		return this._itemStore;
	},

	/**
	 * Checks if more elements can be added to the cargo container
	 * 
	 * @param item the CargoItem we want to add
	 * @returns whether or not more elements can be added to the cargo container
	 */
	hasSpace: function(item) {
		var itemType = item.type();
		if (this._itemStore.hasOwnProperty(itemType)) {
			// We might be able to stuff this into an existing slot.
			return (this._itemStore[itemType] < this.STACK_SIZE);
		} else {
			// We'll need to allocate a new slot for this.
			var numUsedSlots = Object.keys(this._itemStore).length;
			return (numUsedSlots < this.numSlots());
		}
	},

	/**
	 * Gets the number of slots in the cargo container.
	 * 
	 * @returns the number of slots in the cargo container
	 */
	numSlots: function() {
		return this._numSlots;
	},

	/**
	 * Gets the full capacity of the cargo container
	 * 
	 * @returns the capacity of the cargo container (num slots * num items per slot)
	 */
	capacity: function() {
		return this._numSlots * this.STACK_SIZE;
	},

	/**
	 * Gets the number of CargoItems contained in this cargo container
	 * 
	 * @returns the number of items in this container
	 */
	numItems: function() {
		var sum = 0;
		for(var itemType in this._itemStore) {
			if (this._itemStore.hasOwnProperty(itemType)) {
				sum += this._itemStore[itemType];
			}
		}
		return sum;
	},

	/**
	 * Gets the number of items in this container of a specific type.
	 * 
	 * @param the item type to count
	 * @returns the number of items of a specific type
	 */
	numOfType: function(itemType) {
		if (this._itemStore.hasOwnProperty(itemType)) {
			return this._itemStore[itemType];
		}

		return 0;
	},

	/**
	 * Dumps info about this container to the console.
	 */
	debugDump: function() {
		console.log(":: numSlots " + this.numSlots());
		console.log(":: numItems " + this.numItems());
		for (var key in this._itemStore) {
			console.log(":: block type: " + key + ", #[" + this._itemStore[key] + "]");
		}
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = CargoContainer;
}
