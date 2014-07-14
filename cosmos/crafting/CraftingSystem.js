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
			ige.network.define('cosmos:CraftingSystem._craftServer.success');
		}
		if (ige.isClient) {
			ige.network.define('cosmos:crafting.addRecipe', this._addRecipeClient);
			ige.network.define('cosmos:CraftingSystem._craftServer.success', this._onCraftServerSuccess);
			// Update the crafting state so items are correctly grayed out in the UI
			ige.on('cargo response', this._refreshCraftingState);
			ige.on('cargo update', this._refreshCraftingState);
		}
		this.log('Crafting system initiated!');
	},

	// Called by the client to craft an item. This sends a network command to the
	// server to do the actual crafting verification
	craftClient: function(recipeName) {
		ige.network.send('cosmos:crafting.craft', recipeName);
	},

	// Called by the server in response to a client craft request. This verifies
	// and does the crafting.
	_craftServer: function (data, clientId) {
		var player, cargo, recipeName;

		// Check if player exists
		player = ige.server.players[clientId];
		if (player === undefined) {
			ige.craftingSystem.log('CraftingSystem#_craftServer: Player is undefined', 'warning');
			return;
		}
		// Check if player cargo exists
		cargo = player.cargo;
		if (cargo === undefined) {
			ige.craftingSystem.log('CraftingSystem#_craftServer: Cargo is undefined', 'warning');
			return;
		}
		recipeName = data;
		// Check if recipe exists in the game
		if (!Recipes.hasOwnProperty(recipeName)) {
			ige.craftingSystem.log('CraftingSystem#_craftServer: Recipe does not exist', 'warning');
			return;
		}

		if (ige.craftingSystem._canCraft(cargo, player, recipeName)) {
			ige.craftingSystem._doCraft(cargo, player, recipeName);
			ige.network.stream.queueCommand('cosmos:CraftingSystem._craftServer.success',
				recipeName, clientId);
		}

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
		var clientId = player.clientId();
		var cargoItems = cargo.getItemList(true);
		// Check if the player has this recipe unlocked
		if (!player.crafting.recipes().hasOwnProperty(recipeName)) {
			ige.network.stream.queueCommand('notificationError',
				NotificationDefinitions.errorKeys.crafting_recipeNotUnlocked,
				clientId);
			return false;
		}
		var recipe = Recipes[recipeName];
		// Check for correct number of reactant blocks in cargo
		for (var i = 0; i < recipe.reactants.length; i++) {
			var reactant = recipe.reactants[i];
			if (!cargoItems.hasOwnProperty(reactant.blockType) ||
				cargoItems[reactant.blockType] < reactant.quantity)
			{
				ige.network.stream.queueCommand('notificationError',
					NotificationDefinitions.errorKeys.crafting_insufficientReactants,
					clientId);
				return false;
			}
		}

		for (var i = 0; i < recipe.equipment.length; i++) {
			var equipment = recipe.equipment[i];
			if (player.blocksOfType(equipment).length < equipment.quantity) {
				ige.network.stream.queueCommand('notificationError',
					NotificationDefinitions.errorKeys.crafting_insufficientEquipment,
					clientId);
				return false;
			}
		}

		// Check if there is enough room in the cargo for the products
		// Net space needed = products - reactants. For now, all recipes have one product so start this variable
		// at 1.
		var spaceNeeded = 1;
		_.forEach(recipe.reactants, function(reactant) {
			spaceNeeded -= reactant.quantity;
		});
		if (!cargo.spaceAvailable(spaceNeeded)) {
			ige.network.stream.queueCommand('notificationError',
				NotificationDefinitions.errorKeys.crafting_insufficientCargoSpace,
				clientId);
		}

		return true;
	},

	/**
	 * Removes reactants from cargo and adds products to cargo
	 * This should be called after _canCraft()
	 */
	_doCraft: function(cargo, player, recipeName) {
		var recipe = Recipes[recipeName];
		// Consume reactants. Remove them from cargo
		_.forEach(recipe.reactants, function(reactant) {
			cargo.removeType(reactant.blockType, reactant.quantity);
		});

		cargo.addBlock(recipeName);

		DbPlayer.update(player.dbId(), player, function() {});
	},

	// @client-side
	_onCraftServerSuccess: function(data) {
		var recipeName = data;
		ige.notification.emit('notificationSuccess', NotificationDefinitions.successKeys.crafting_success);
		ige.craftingSystem.emit('cosmos:CraftingSystem.craft.success', recipeName);

	},

	// Add a recipe to a player
	addRecipeServer: function(recipe, player, clientId) {
		player.crafting.addRecipe(recipe);
		ige.network.stream.queueCommand('cosmos:crafting.addRecipe',
			recipe, clientId);
	},

	// Keep the client side recipe list in sync
	_addRecipeClient: function(data) {
		var recipe = data;
		ige.client.player.crafting.addRecipe(recipe);
	},

	// Keep client side crafting state consistent
	_refreshCraftingState: function(data) {
		//var cargoItems = data;
		//ige.client.player.crafting.resetCraftableRecipes();
		// TODO: Refresh craftable recipes based on cargoItems
		ige.hud.leftToolbar.windows.craftingUI.refresh();
	},

	// TODO:Serialize and persist to DB
	serializeRecipes: function() {

	},

	rehydrateRecipes: function () {
	}



});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingSystem; }
