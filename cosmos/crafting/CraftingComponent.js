/* Crafting component
 * This is a player component
 * This component is meant to be initialized client-side and server-side
 */

var CraftingComponent = IgeEventingClass.extend({
	classId: 'CraftingComponent',
	componentId: 'crafting',
	// All the recipes the player knows
	_recipes: undefined,
	// The recipes that are craftable (correct number of reactants in cargo)
	_craftableRecipes: undefined,

	init: function(entity, options) {
		// TODO: Client side crafting should have an idea of the cargo. This allows
		// uncraftable things to be grayed out. Pending cargo refactor

		// TODO: Load unlocked recipes from DB. For now, we have a
		// predefined set of recipes.
		this._recipes = CraftingComponent.starterRecipes();
		this._craftableRecipes = CraftingComponent.starterRecipes();
	},

	recipes: function() {
		return this._recipes;
	},

	addRecipe: function(recipe) {
		this._recipes[recipe] = true;
	},

	craftableRecipes: function() {
		return this._craftableRecipes;
	},

	addCraftableRecipe: function(recipe) {
		this._craftableRecipes[recipe] = true;
	},

	resetCraftableRecipes: function() {
		this._craftableRecipes = {};
	}
});

/**
 * List of block types that can be initially crafted
 */
CraftingComponent.starterRecipes = function() {
	// Create an object that has the same keys as the Recipes object and has the value true
	// for all keys. In effect, this is a basic starter recipes set that includes all the
	// recipes in the game.
	var starterRecipes = _.mapValues(Recipes, function(blockType) {
		return true;
	});

	console.log(JSON.stringify(starterRecipes));

	return starterRecipes;
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingComponent; }
