var Cargo = IgeClass.extend({
	classId: 'Cargo',
	
	/**
	 * Define the capacities of cargo blocks, in terms of size in tiles.
	 */
	CHUNKS_PER_TILE: 9,
	BLOCKS_PER_TILE: 1,
	
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
	 * The list of items. Each item contains a reference to its container and vice versa.
	 */
	_items: undefined,

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

	addBlock: function(block) {
		if (block === undefined) {
			return this;
		}

		// Construct a new item from the block
		var cargoItem = new CargoItem(block);
		return this.addCargoItem(cargoItem);
	},

	addBlocks: function(blocks) {
		for (var block in blocks) {
			this.addBlock(block);
		}

		return this;
	},

	addCargoItem: function(item) {
		if (item === undefined || !this.hasSpace()) {
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
		
		// Add items to the item list and to an available cargo container.
		this._items.push(item);

		// Right now, linearly fill up the containers.
		for (var i = 0; i < this.getNumContainers(); i++) {
			// Check if the container has space.
			var container = this.getContainer(i);
			if (container.hasSpace()) {
				return container.linkItem(item);
			} else {
				continue;
			}
		}

		// Should never get here
		return false;
	},
	
	addCargoItems: function(items) {
		for (var item in items) {
			this.addCargoItem(item);
		}

		return this;
	},

	removeItem: function(itemId) {
		var itemToRemove = this.getItem(itemId);

		// Remove the item from the item list
		var itemIndex = this._items.indexOf(itemToRemove);
		ArrayUtils.remove(this._items, itemIndex);

		// Remove the item from a container.
		var itemContainer = itemToRemove.container();
		itemContainer.unlinkItem(itemId);
	},

	removeItems: function(itemType) {
		// Find all of the items in the list to remove
		var indicesForRemoval = [];
		for (var i = 0; i < this._items.length; i++) {
			var item = this._items[i];
			if (item.type() === itemType) {
				indicesForRemoval.push(i);
			}
		}

		// Now, remove all selected elements and unlink them via removeItem().
		for (var index in indicesForRemoval) {
			var item = this._items[index];
			this.removeItem(item.uuid());
		}

		return this;
	},

	getItem: function(itemId) {
		for (var item in this._items) {
			if (item.uuid() === itemId) {
				return item;
			}
		}

		return undefined;
	},
	
	getItems: function(itemType) {
		var results = [];
		for (var item in this._items) {
			if (item.type() === itemType) {
				results.push(item);
			}
		}
	},
	
	listItems: function(clone) {
		if (clone !== undefined && clone) {
			return JSON.parse(JSON.stringify(clone));
		}
		return this._items;
	},
	
	hasSpace: function() {
		if (this.unlimitedSpace()) {
			return true;
		}

		for (var i = 0; i < this.getNumContainers(); i++) {
			// Check if the container has space.
			var container = this.getContainer(i);
			if (container.hasSpace()) {
				return true;
			}
		}

		return false;
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
		throw "Not implemented!";
	},
	
	/**
	 * Retrieves the number of CargoContainers that this player has.
	 */
	getNumContainers: function() {
		return this._containers.length;
	} 
});