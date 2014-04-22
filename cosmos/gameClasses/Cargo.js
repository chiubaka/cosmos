var Cargo = IgeClass.extend({
	classId: 'Cargo',
	
	/**
	 * Define the capacities of cargo blocks, in terms of size in tiles.
	 */
	CHUNKS_PER_TILE: 9,
	BLOCKS_PER_TILE: 1,
	
	/**
	 * Whether or not we want to respect cargo capacities right now.
	 * Can initialize this to true to allow all players to have unlimited cargo capacity.
	 */
	_isUnlimited: false,
	
	/**
	 * The cargo containers that make up the player's cargo inventory.
	 * CargoContainers contain a reference to a block in the world and a list
	 * of references to CargoItems that are contained within them (for fast lookup).
	 */
	_containers: [],
	
	/**
	 * The items contained within the player's cargo inventory.
	 */
	_items: [],

	/**
	 * Initialize the cargo model for a player.
	 */
	init: function() {
		throw "Not implemented!";
	},
	
	//
	// ITEM MANAGEMENT
	//

	addItem: function(item) {
		throw "Not implemented!";
	},
	
	addItems: function(items) {
		throw "Not implemented!";
	},

	removeItem: function(item) {
		throw "Not implemented!";
	},

	removeAllItems: function(itemId) {
		throw "Not implemented!";
	},
	
	getItems: function(itemId) {
		throw "Not implemented!";
	},
	
	listItems: function() {
		throw "Not implemented!";
	},
	
	hasSpace: function() {
		throw "Not implemented!";
	},
	
	//
	// CHUNK MANAGEMENT (TODO)
	//
	addChunk: function(chunk) {
		throw "Not implemented!";
	},

	removeChunk: function(chunk) {
		throw "Not implemented!";
	},

	listChunk: function() {
		throw "Not implemented!";
	},
	
	canAddChunk: function() {
		throw "Not implemented!";
	},

	/**
	 * Check if the player's cargo inventory contains a particular type of item.
	 */
	hasItem: function(itemId) {
		throw "Not implemented!";
	},
	
	/** 
	 * Retrieve a specific cargo container from a player's cargo inventory.
	 */
	getContainer: function(index) {
		throw "Not implemented!";
	}
});