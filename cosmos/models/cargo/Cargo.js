/**
 * Cargo.js
 * @author Derrick Liu
 * 
 * The Cargo class represents a player's entire cargo inventory. 
 * This class provides a high-level interface for managing cargo items.
 * 
 * In the future, other classes can extend the base CargoContainer and CargoItem classes
 * to provide additional functionality reasonably easily.
 *
 * @class
 * @typedef {Object} Cargo
 * @namespace  
 */
var Cargo = IgeClass.extend({
	classId: 'Cargo',
	
	/**
	 * The number of cargo containers that a single physical Cargo block represents.
	 * @constant {number}
	 * @default
	 * @memberof Cargo
	 * @instance
	 */
	CONTAINERS_PER_BLOCK: 1,
	
	/**
	 * Whether or not we want to respect cargo capacities right now.
	 * Can initialize this to true to allow all players to have
	 * an unlimited number of cargo containers.
	 * @type {boolean}
	 * @default
	 * @memberof Cargo
	 * @instance
	 * @private
	 */
	_isUnlimited: true,
	
	/**
	 * The cargo containers that make up the player's cargo inventory.
	 * CargoContainers contain a reference to a block in the world and a list
	 * of references to CargoItems that are contained within them.
	 * @type {Array}
	 * @memberof Cargo
	 * @instance
	 * @private
	 */
	_containers: undefined,

	/**
	 * Initialize the cargo model for a player.
	 * @memberof Cargo
	 * @instance
	 */
	init: function() {
		this._containers = [];
		this._items = [];
		this.updateList = [];
	},
	
	/**
	 * Gets or sets whether or not the cargo inventory has an unlimited capacity.
	 * 
	 * @param flag {boolean} the value to set the flag to
	 * @returns {boolean} whether or not the cargo inventory has an unlimited capacity
	 * @memberof Cargo
	 * @instance
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
	 * @param blockType {string} the type of block to add to the inventory
	 * @returns {boolean} whether or not the add was successful
	 * @memberof Cargo
	 * @instance
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
	 * @param blockTypes {Array} an array of all of the blockTypes to add
	 * @returns {Array} a list of booleans representing the success of adding the list of blocks
	 * @memberof Cargo
	 * @instance
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
	 * @param item {Object} the CargoItem to add
	 * @returns {boolean} whether or not the add was successful
	 * @memberof Cargo
	 * @instance
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
					this.sendUpdates();
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
	 * @param items {Array} an array of CargoItems to add
	 * @returns {Array} a list of booleans representing the success of adding the list of blocks
	 * @memberof Cargo
	 * @instance
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
	 * @param itemType {string} the item type to remove
	 * @param quantity {number} the number of items to try to remove (upper bound). Defaults to 1
	 * @returns {number} the number of items actually removed (up to quantity items)
	 * @memberof Cargo
	 * @instance
	 */
	removeType: function(itemType, quantity) {
		if (quantity === undefined) {
			quantity = 1;
		}
		var remaining = Math.min(quantity, this.numItems());
		var numRemoved = 0;
		if (remaining == 0) {
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
	 * @param itemType {string} the type of items to remove (given by classId)
	 * @returns {number} the total number of items removed
	 * @memberof Cargo
	 * @instance
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
	 * @memberof Cargo
	 * @instance
	 */
	removeAll: function() {
		console.error('abort - not implemented');
	},

	/**
	 * Extracts a specific number of items from the player's cargo inventory.
	 * This is similar to a withdrawal: the items will be removed from the inventory
	 * and returned to the caller.
	 * 
	 * @param itemType {string} the item's type
	 * @param quantity {number} the number of items to extract
	 * @returns {Array} a list of items that were extracted
	 * @memberof Cargo
	 * @instance
	 */
	extractType: function(itemType, quantity) {
		var extracted = [];

		if (quantity === undefined) {
			quantity = 1;
		}
		var remaining = Math.min(quantity, this.numItems());
		if (remaining == 0) {
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

		if (extracted.length > 0) {
			this.sendUpdates();
		}
		
		return extracted;
	},

	/**
	 * Extracts a specific number of items from the player's cargo inventory, 
	 * with types chosen by round-robin selection.
	 * 
	 * @param quantity {number} the number of items to extract
	 * @returns {Array} a list of items that were extracted 
	 * @memberof Cargo
	 * @instance
	 * @deprecated
	 */
	rrExtractItems: function(quantity) {
		var extracted = [];

		if (quantity === undefined) {
			quantity = 1;
		}
		var remaining = Math.min(quantity, this.numItems());
		if (remaining == 0) {
			return extracted;
		}

		for (var i = 0; i < this.getNumContainers() ; i++) {
			var container = this.getContainer(i);
			var extractedFromContainer = container.rrExtractItems(remaining);

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
	 * Check if the player's cargo inventory contains a particular type of item.
	 * 
	 * @param itemType {string} the item type to look for
	 * @returns {boolean} whether or not the cargo inventory the type of item
	 * @memberof Cargo
	 * @instance
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
	 * @returns {number} the total number of items in the cargo inventory
	 * @memberof Cargo
	 * @instance
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
	 * Gets the number of items in the cargo inventory of a specific item type
	 *
	 * @param itemType {string} the blockId of the item
	 * @returns {number} the number of items of this type in the cargo inventory
	 * @memberof Cargo
	 * @instance
	 */
	numOfType: function(itemType) {
		var total = 0;
		for (var i = 0; i < this.getNumContainers() ; i++) {
			var container = this.getContainer(i);
			total += container.numOfType(itemType);
		}

		return total;
	},
	
	/** 
	 * Retrieve a specific cargo container from a player's cargo inventory.
	 * 
	 * @param index {number} the index of the specific cargo container
	 * @returns {Object} the cargo container (or undefined)
	 * @memberof Cargo
	 * @instance
	 */
	getContainer: function(index) {
		return this._containers[index];
	},
	
	/**
	 * Retrieves the number of cargo containers that this player has.
	 * 
	 * @returns {number} the number of cargo containers
	 * @memberof Cargo
	 * @instance
	 */
	getNumContainers: function() {
		return this._containers.length;
	},

	/**
	 * Retrieves a list of all of the items in this cargo inventory.
	 * 
	 * @param coalesce {boolean} Whether or not to coalesce items of the same type 
	 * in separate containers into a single entry in the list.
	 * @returns {Object} a dictionary of types, and the number of elements of each type
	 * @memberof Cargo
	 * @instance
	 */
	getItemList: function(coalesce) {
		var returnDict = {};

		for (var i = 0; i < this.getNumContainers(); i++) {
			var container = this.getContainer(i);

			var containerItemList = container.getItemList();

			for (var itemType in containerItemList) {
				var storeType = itemType;

				if (!coalesce) {
					storeType += ":container" + i;
				}

				if (!returnDict.hasOwnProperty(storeType)) {
					returnDict[storeType] = 0;
				}

				returnDict[storeType] += containerItemList[itemType];
			}
		}

		return returnDict;
	},

	/**
	 * Prints a debug log of a container to the console.
	 * 
	 * @params the container number
	 * @memberof Cargo
	 * @instance
	 */
	debugDump: function(i) {
		console.log(":: cargo container #" + i);
		this.getContainer(i).debugDump();
	},

	/**
	 * Subscribes a client (according to the clientId) to receiving cargo updates whenever
	 * the cargo is modified (add or extract block).
	 * 
	 * @param clientId {string} the client to subscribe
	 * @memberof Cargo
	 * @instance
	 */
	subscribeToUpdates: function(clientId) {
		this.log("Registering clientId " + clientId + " to cargo updates", 'info');
		this.updateList.push(clientId);
	},

	/**
	 * Unsubscribes a client from receiving cargo updates.
	 * 
	 * @param clientId {string} the client to unsubscribe
	 * @memberof Cargo
	 * @instance
	 */
	unsubscribeFromUpdates: function(clientId) {
		var clientIndex = this.updateList.indexOf(clientId);
		if (clientIndex >= 0) {
			this.log("Unregistering clientId " + clientId + " from cargo updates", 'info');
			this.updateList.remove(clientIndex);
		}
	},

	/**
	 * Iterate through the list of subscribed clients and send a cargo update to each one.
	 * @memberof Cargo
	 * @instance
	 */
	sendUpdates: function() {
		if (this.updateList.length === 0) {
			return;
		}

		// TODO: this doesn't need to be a list now, but can be useful in the future
		// when game mechanics require players to access each other's inventories.
		for (var i = 0; i < this.updateList.length; i++) {
			var cargoList = this.getItemList(true);
			var clientId = this.updateList[i];
			ige.network.send('cargoUpdate', cargoList, clientId);
		}
	},

	/**
	 * Serializes the cargo containers and its contents for insertion
	 * into a database.
	 * @memberof Cargo
	 * @instance
	 */
	serializeCargo: function() {
		var data = [];
		for (var i = 0; i < this.getNumContainers(); i++) {
			var container = this.getContainer(i);
			// Serialize container properties, like numSlots
			var containerMeta = {numSlots: container.numSlots()};
			// Serialize container items
			var containerData = container.getItemList();
			data.push({containerMeta: containerMeta, containerData: containerData});
		}
		return data;
	},

	/**
	 * Rehydrates cargo information from a database
	 * @param data {Array} an array of containers and container data from which to rehydrate the cargo
	 * @memberof Cargo
	 * @instance
	 */
	rehydrateCargo: function(data) {
		// TODO: Sentinal value for empty cargo
		// Player has no cargo saved in DB
		if (data === undefined) {
			return;
		}

		for (var i = 0; i < data.length; i++) {
			var container = data[i];
			var numSlots = container.containerMeta.numSlots;
			var itemStore = container.containerData;
			var cargoContainer = new CargoContainer(numSlots, itemStore);

			this._containers.push(cargoContainer);
		}
	}

});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	 module.exports = Cargo;
}
