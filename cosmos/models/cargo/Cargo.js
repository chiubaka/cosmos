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
	 * The number of cargo containers that a single physical Cargo block represents.
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
	
	/**
	 * Gets or sets whether or not the cargo inventory has an unlimited capacity.
	 * 
	 * @param the value to set the flag to
	 */
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
	 * 
	 * @param blockType the type of block to add to the inventory
	 * @returns whether or not the add was successful
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
	 * Adds a list of block types to the player's cargo inventory using addBlockFromType().
	 * 
	 * @param blockTypes an array of all of the blockTypes to add
	 * @returns a list of booleans representing the success of adding the list of blocks
	 */
	addBlocks: function(blockTypes) {
		var addedList = [];

		for (var block in blockTypes) {
			var success = this.addBlock(block);
			addedList.push(success);
		}

		return addedList;
	},

	/**
	 * Adds a single existing CargoItem to the player's cargo inventory.
	 * Does NOT automatically encapsulate objects into CargoItems.
	 * 
	 * @param item the CargoItem to add
	 * @returns whether or not the add was successful
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
				this._containers.push(new CargoContainer());
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
	 * 
	 * @param items an array of CargoItems to add
	 * @returns a list of booleans representing the success of adding the list of blocks
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
	 * 
	 * @param itemType the item type to remove (as returned by addItem)
	 * @param quantity the number of items to try to remove (upper bound). Defaults to 1
	 * @returns the number of items actually removed (up to quantity items)
	 */
	removeType: function(itemType, quantity) {
		if (quantity === undefined) {
			quantity = 1;
		}
		var remaining = Math.min(quantity, this.numItems());
		var numRemoved = 0;
		if (remaining == 0) {
			console.log("No items to remove!");
			return numRemoved;
		}

		for (var i = 0; i < this.getNumContainers(); i++) {
			var container = this.getContainer(i);
			var containerRemoved = container.removeType(itemType, remaining);

			remaining -= containerRemoved;
			numRemoved += containerRemoved;

			if (remaining == 0) {
				break;
			}
		}

		return numRemoved;
	},

	/**
	 * Removes all items of a specific type from the player's cargo inventory.
	 * 
	 * @param itemType the type of items to remove (given by classId)
	 * @returns the total number of items removed
	 */
	removeAllOfType: function(itemType) {
		var totalItemsRemoved = 0;
		for (var i = 0; i < this.getNumContainers(); i++) {
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
	 * @returns a list of items that were extracted
	 */
	extractType: function(itemType, quantity) {
		var extracted = [];

		if (quantity === undefined) {
			quantity = 1;
		}
		var remaining = Math.min(quantity, this.numItems());
		if (remaining == 0) {
			console.log("No items to extract!");
			return extracted;
		}

		for (var i = 0; i < this.getNumContainers(); i++) {
			var container = this.getContainer(i);
			var extractedFromContainer = container.extractType(itemType, remaining);

			extracted = extracted.concat(extractedFromContainer);
			remaining -= extractedFromContainer.length;
			if (remaining == 0) {
				break;
			} else if (remaining < 0) {
				console.error("Removed more items from container #" + i + " than existed! Surely something must be wrong.");
				return extracted;
			}
		}

		return extracted;
	},

	/**
	 * Extracts a specific number of items from the player's cargo inventory, 
	 * with types chosen by round-robin selection.
	 * 
	 * @param quantity the number of items to extract
	 * @returns a list of items that were extracted 
	 */
	rrExtractItems: function(quantity) {
		var extracted = [];

		if (quantity === undefined) {
			quantity = 1;
		}
		var remaining = Math.min(quantity, this.numItems());
		if (remaining == 0) {
			console.log("No items to extract!");
			return extracted;
		}

		console.log("rrExtractItems: start: " + this.numItems() + " in cargo inventory");
		for (var i = 0; i < this.getNumContainers() ; i++) {
			var container = this.getContainer(i);
			var extractedFromContainer = container.rrExtractItems(remaining);

			extracted = extracted.concat(extractedFromContainer);
			remaining -= extractedFromContainer.length;
			if (remaining == 0) {
				break;
			} else if (remaining < 0) {
				console.error("Removed more items from container #" + i + " than existed! Surely something must be wrong.");
				console.log("Extracted: " + extracted);
				return extracted;
			}
		}
		console.log("rrExtractItems: extracted " + extracted.length + " items.");
		console.log("Extracted: " + extracted);

		return extracted;
	},
	
	/**
	 * Check if the player's cargo inventory contains a particular type of item.
	 * 
	 * @param the item type to look for
	 * @returns whether or not the cargo inventory the type of item
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
	 * Gets the total number of items in the cargo inventory
	 * 
	 * @returns the total number of items in the cargo inventory
	 */
	numItems: function() {
		var total = 0;
		for (var i = 0; i < this.getNumContainers() ; i++) {
			var container = this.getContainer(i);
			total += container.numItems();
		}

		return total;
	},
	
	/** 
	 * Retrieve a specific cargo container from a player's cargo inventory.
	 * 
	 * @param index the index of the specific cargo container
	 * @returns the cargo container (or undefined)
	 */
	getContainer: function(index) {
		return this._containers[index];
	},
	
	/**
	 * Retrieves the number of cargo containers that this player has.
	 * 
	 * @returns the number of cargo containers
	 */
	getNumContainers: function() {
		return this._containers.length;
	},

	/**
	 * Prints a debug log of a container to the console.
	 * 
	 * @params the container number
	 */
	debugDump: function(i) {
		console.log(":: cargo container #" + i);
		this.getContainer(i).debugDump();
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	 module.exports = Cargo;
}