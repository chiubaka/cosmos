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
			ige.network.define('cosmos:crafting.addRecipe');
		}
		if (ige.isClient) {
			ige.network.define('cosmos:crafting.addRecipe', this._addRecipeClient);
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
		var player, cargo, recipeName;

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
		recipeName = data;

		if (ige.craftingSystem._canCraft(cargo, player, recipeName)) {
			console.log('Craftable');
			ige.craftingSystem._doCraft(cargo, recipeName);
		};

	},
	
	/**
	 * Checks if the recipe is craftable by the player.
	 * A recipe is craftable if the player has:
	 * 1. The recipe unlocked
	 * 2. The correct number of reactant blocks in cargo
	 * 3. The correct number of equipment blocks on the ship
	 * 4. Space in their cargo for the products
	 * @param cargo {Cargo}
	 * @param player {Player}
	 * @param recipeName {String}
	 * @returns {Boolean} True if the recipe is craftable
	 */
	_canCraft: function(cargo, player, recipeName) {
		var cargoItems = cargo.getItemList(true);
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
		// Check if there is enough room in the cargo for the products
		// Net space needed = products - reactants
		var spaceNeeded = 0;
		for (product in recipe.products) {
			if (recipe.products.hasOwnProperty(product)) {
				spaceNeeded += recipe.products[product];
			}
		}
		for (reactant in recipe.reactants) {
			if (recipe.reactants.hasOwnProperty(reactant)) {
				spaceNeeded -= recipe.reactants[reactant];
			}
		}
		if (!cargo.spaceAvailable(spaceNeeded)) {
			return false;
		}

		return true;
	},

	/**
	 * Removes reactants from cargo and adds products to cargo
	 * This should be called after _canCraft()
	 */
	_doCraft: function(cargo, recipeName) {
		var recipe = Recipies[recipeName];
		// Consume reactants. Remove them from cargo
		for (reactant in recipe.reactants) {
			var numToRemove = recipe.reactants[reactant];
			cargo.removeType(reactant, numToRemove);
		}
		// Produce products. Add them to cargo
		for (product in recipe.products) {
			cargo.addBlock(product);
		}

		console.log('doCraft: ' + recipeName);
	},

	// Add a recipie to a player
	addRecipeServer: function(recipe, player, clientId) {
		player.crafting.recipies()[recipe] = true;
		ige.network.stream.queueCommand('cosmos:crafting.addRecipe',
			recipe, clientId);
	},

	// Keep the client side recipies list in sync
	_addRecipeClient: function(data) {
		var recipe = data;
		ige.client.player.crafting.recipies()[recipe] = true;
	},

	// TODO:Serialize and persist to DB
	serializeRecipies: function() {

	},

	rehydrateRecipies: function () {
	}



});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingSystem; }
