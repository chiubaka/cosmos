/* Crafting component
 * This is a player component
 * This component is meant to be initialized client-side and server-side
 */

var CraftingComponent = IgeEventingClass.extend({
	classId: 'CraftingComponent',
	componentId: 'crafting',
	// All the recipies the player knows
	_recipies: undefined,
	// The recipies that are craftable (correct number of reactants in cargo)
	_craftableRecipies: undefined,

	init: function(entity, options) {
		// TODO: Client side crafting should have an idea of the cargo. This allows
		// uncraftable things to be grayed out. Pending cargo refactor

		// TODO: Load unlocked recipies from DB. For now, we have a
		// predefined set of recipies.
		this._recipies = StarterRecipies;
		this._craftableRecipies = StarterRecipies;
	},

	recipies: function() {
		return this._recipies;
	},

	addRecipe: function(recipe) {
		this._recipies[recipe] = true;
	},

	craftableRecipies: function() {
		return this._craftableRecipies;
	},

	addCraftableRecipe: function(recipe) {
		this._craftableRecipies[recipe] = true;
	},

	resetCraftableRecipies: function() {
		this._craftableRecipies = {};
	},

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingComponent; }
