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
	 * of references to CargoItems that are contained within them (for fast lookup).
	 */
	_containers: [],

	/**
	 * Initialize the cargo model for a player.
	 */
	init: function() {
		throw "Not implemented!";
	},
	
	unlimitedSpace: function(flag) {
		if (flag !== undefined) {
			this._isUnlimited = flag;
			return this;
		}

		return this._isUnlimited;
	},
	
	//
	// ITEM MANAGEMENT
	//

	addItem: function(item) {
		if (item === undefined || !this.hasSpace()) {
			// Do nothing, abort.
			return this;
		}
		
		if (this.getNumContainers() == 0) {
			// No container exists for this item. This means
			// that the ship has no cargo blocks.
			
			if (this.unlimitedSpace()) {
				// Create a new cargo container to contain the item.
				this._containers.push(new CargoContainer());
			}
		}
		
		// Add items to the item list and to an available cargo container.
		// Right now, linearly fill up the containers.
		for (var i = 0; i < this.getNumContainers(); i++) {
			// Check if the container has space.
			var container = this.getContainer(i);
			if (container.hasSpace()) {
				container.addItem(item);
			} else {
				continue;
			}
		}

		return this;
	},
	
	addItems: function(items) {
		for (var item in items) {
			this.addItem(item);
		}

		return this;
	},

	removeItem: function(itemId) {
		throw "Not implemented!";
	},

	removeAllItems: function(itemType) {
		throw "Not implemented!";
	},
	
	getItems: function(itemType) {
		throw "Not implemented!";
	},
	
	listItems: function() {
		throw "Not implemented!";
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
	hasItem: function(itemType) {
		throw "Not implemented!";
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