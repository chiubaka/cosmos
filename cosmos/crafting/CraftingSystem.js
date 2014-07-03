/* Crafting system
 * This is an IGE system
 * This system is meant to be initialized client-side and server-side.
 */

var CraftingSystem = IgeEventingClass.extend({
	classId: 'CraftingSystem',
	componentId: 'craftingSystem',


	init: function(entity, options) {
		if (ige.isServer) {
			ige.network.define('cosmos:crafting.craft', this._craftServer);
		}
		this.log('Crafting system initiated!');
	},

	// Called by the client to craft an item. This sends a network command to the
	// server to do the actual crafting verification
	craftClient: function(recipe) {
		ige.network.send('cosmos:crafting.craft', recipe);
	},

	// Called by the server in response to a client craft request. This verifies
	// and does the crafting.
	_craftServer: function (data, clientId) {
		var player, cargo, cargoItems, recipe;

		console.log("Player '" + clientId + "' wants to craft: '" + data + "'");

		// Check if player exists
		player = ige.server.players[clientId];
		if (player === undefined) {
			ige.craftingSystem.log('CraftingSystem._craftServer: Player is undefined', 'warning');
			return;
		}
		// Check if player cargo exists
		cargo = player.cargo;
		if (cargo === undefined) {
			ige.craftingSystem.log('CraftingSystem._craftServer: Cargo is undefined', 'warning');
			return;
		}
		// Check if recipe exists in the game
		if (!Recipies.hasOwnProperty(data)) {
			ige.craftingSystem.log('CraftingSystem._craftServer: Recipe does not exist', 'warning');
			return;
		}
		recipe = data;

		cargoItems = cargo.getItemList(true);
		if (ige.craftingSystem.canCraft(cargoItems, player, recipe)) {
			console.log('Craftable');
			ige.craftingSystem.doCraft();
		};

	},
	
	/**
	 * Checks if the recipe is craftable by the player.
	 * A recipe is craftable if the player has:
	 * 1. The recipe unlocked
	 * 1. The correct number of reactant blocks in cargo
	 * 2. The correct number of equipment blocks on the ship
	 * @param cargoItems {Object}
	 * @param player {Player}
	 * @param recipeName {String}
	 * @returns {Boolean} True if the recipe is craftable
	 */
	canCraft: function(cargoItems, player, recipeName) {
		// Check if the player has this recipe unlocked
		if (!player.crafting.recipies().hasOwnProperty(recipeName)) {
			console.log('canCraft: recipe not unlocked');
			return false;
		}
		var recipe = Recipies[recipeName];
		// Check for correct number of reactant blocks in cargo
		for (reactant in recipe.reactants) {
			if (!cargoItems.hasOwnProperty(reactant) ||
				cargoItems[reactant] < recipe.reactants[reactant]) {
				console.log('Insufficient reactants in cargo');
				return false;
			}
		}
		// Check for correct number of equipment blocks on the ship
		for (equipment in recipe.equipments) {
			if (player.blocksOfType(equipment).length < recipe.equipments[equipment]) {
				console.log('Insufficient equipment on ship');
				return false;
			}
		}
		return true;
	},



	doCraft: function(cargo, recipe) {
		console.log('doCraft: ' + recipe);
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingSystem; }
