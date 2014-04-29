/**
 * Cargo.js
 * @author Derrick Liu
 * 
 * The Cargo class represents a player's entire cargo inventory. 
 * This class provides a high-level interface for managing cargo items.
 * 
 * In the future, other classes can extend the base CargoContainer and CargoItem classes
 * to provide additional functionality reasonably easily.
 */
var Cargo = IgeClass.extend({
	classId: 'Cargo',
	
	/**
	 * Define the capacities of cargo blocks, in terms of size in tiles.
	 */
	CONTAINERS_PER_BLOCK: 1,
	
	/**
	 * Whether or not we want to respect cargo capacities right now.
	 * Can initialize this to true to allow all players to have
	 * an unlimited number of cargo containers.
	 */
	_isUnlimited: true,
	
	/**
	 * The cargo containers that make up the player's cargo inventory.
	 * CargoContainers contain a reference to a block in the world and a list
	 * of references to CargoItems that are contained within them.
	 */
	_containers: undefined,

	/**
	 * Initialize the cargo model for a player.
	 */
	init: function() {
		this._containers = [];
		this._items = [];
	},
	
	unlimitedSpace: function(flag) {
		if (flag !== undefined) {
			this._isUnlimited = flag;
			return this;
		}

		return this._isUnlimited;
	},

	/**
	 * Adds a block of a specific block type to the player's cargo inventory.
	 * Automatically encapsulates blockTypes into CargoItems
	 * @param blockType the type of block to add to the inventory
	 */
	addBlock: function(blockType) {
		if (blockType === undefined || blockType === "") {
			return false;
		}

		// Construct a new item from the block
		var cargoItem = new CargoItem(blockType);

		return this.addCargoItem(cargoItem);
	},

	/**
	 * Adds a list of Blocks to the player's cargo inventory using addBlockFromType().
	 * @param blockTypes an array of all of the blockTypes to add
	 */
	addBlocks: function(blockTypes) {
		var addedList = [];

		for (var block in blockTypes) {
			var uuid = this.addBlock(block);
			addedList.push(uuid);
		}

		return addedList;
	},

	/**
	 * Adds a single existing CargoItem to the player's cargo inventory.
	 * Does NOT automatically encapsulate objects into CargoItems.
	 * @param item the CargoItem to add
	 */
	addCargoItem: function(item) {
		if (item === undefined) {
			// Do nothing, abort.
			return false;
		}
		
		if (this.getNumContainers() == 0) {
			// No container exists for this item. This means
			// that the ship has no cargo blocks.
			
			if (this.unlimitedSpace()) {
				// Create a new cargo container to contain the item.
				this._containers.push(new CargoContainer(this.DEFAULT_CONTAINER_SLOTS));
			} else {
				// Abort, we can't add anything.
				return false;
			}
		}

		while (this.unlimitedSpace()) {
			// Right now, linearly fill up the containers.
			for (var i = 0; i < this.getNumContainers(); i++) {
				// Check if the container has space.
				var container = this.getContainer(i);
				if (container.hasSpace(item)) {
					var success = container.addItem(item);
					return success;
				} else {
					continue;
				}
			}

			if (this.unlimitedSpace()) {
				this._containers.push(new CargoContainer());
			}
		}

		return false;
	},
	
	/**
	 * Adds a list of CargoItems to the player's cargo inventory.
	 * @param items an array of CargoItems to add
	 */
	addCargoItems: function(items) {
		var addedList = [];

		for (var item in items) {
			addedList.push(this.addCargoItem(item));
		}

		return addedList;
	},

	/**
	 * Removes (destroys) up to quantity items of a specific type from the cargo inventory
	 * @param itemType the item type to remove (as returned by addItem)
	 * @param quantity the number of items to try to remove (upper bound). Defaults to 1
	 * @returns the number of items actually removed (up to quantity items)
	 */
	removeType: function(itemType, quantity) {
		var remaining = 1;
		if (quantity !== undefined) {
			remaining = quantity;
		}

		for (var i = 0; i < this.getNumContainers(); i++) {
			var container = this.getContainer(i);
			var numRemoved = container.removeType(itemType, remaining);

			remaining -= numRemoved;
			if (remaining == 0) {
				break;
			} else if (remaining < 0) {
				return remaining;
			}
		}

		return remaining;
	},

	/**
	 * Removes all items of a specific type from the player's cargo inventory.
	 * @param itemType the type of items to remove (given by classId)
	 */
	removeAllOfType: function(itemType) {
		var totalItemsRemoved = 0;
		for (var i = 0; i < this.getNumContainers() ; i++) {
			var container = this.getContainer(i);
			totalItemsRemoved += container.removeType(itemType, container.numItems());
		}

		return totalItemsRemoved;
	},

	/**
	 * Remove ALL items from the player's cargo inventory.
	 */
	removeAll: function() {
		console.log('abort - not implemented');
	},

	/**
	 * Extracts a specific number of items from the player's cargo inventory.
	 * This is similar to a withdrawal: the items will be removed from the inventory
	 * and returned to the caller.
	 * 
	 * @param itemType the item's type
	 * @param quantity the number of items to extract
	 * @returns the items that were extracted
	 */
	extractItem: function(itemType, quantity) {
		var extracted = [];
		var remaining = 1;
		if (quantity !== undefined) {
			remaining = quantity;
		}

		for (var i = 0; i < this.getNumContainers() ; i++) {
			var container = this.getContainer(i);
			var extractedFromContainer = container.extractType(itemType, remaining);

			extracted = extracted.concat(extractedFromContainer);
			remaining -= extractedFromContainer.length;
			if (remaining == 0) {
				break;
			} else if (remaining < 0) {
				return remaining;
			}
		}

		return extracted;
	},
	
	/**
	 * Check if the player's cargo inventory contains a particular type of item.
	 */
	hasItemType: function(itemType) {
		for (var i = 0; i < this.getNumContainers() ; i++) {
			var container = this.getContainer(i);
			if (container.hasItemType(itemType)) {
				return true;
			}
		}

		return false;
	},
	
	/** 
	 * Retrieve a specific cargo container from a player's cargo inventory.
	 */
	getContainer: function(index) {
		return this._containers[index];
	},
	
	/**
	 * Retrieves the number of CargoContainers that this player has.
	 */
	getNumContainers: function() {
		return this._containers.length;
	},

	debugDump: function(i) {
		console.log(":: cargo container #" + i);
		this.getContainer(i).debugDump();
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	 module.exports = Cargo;
}