/* Crafting component
 * This is a player component
 * This component is meant to be initialized client-side and server-side
 */

var CraftingComponent = IgeEventingClass.extend({
	classId: 'CraftingComponent',
	componentId: 'crafting',
	// A dictionary of recipe names
	_recipies: undefined,

	init: function(entity, options) {
		// TODO: Client side crafting should have an idea of the cargo. This allows
		// uncraftable things to be grayed out. Pending cargo refactor

		// TODO: Load unlocked recipies from DB. For now, we have a
		// predefined set of recipies.
		this._recipies = StarterRecipies;
	},

	recipies: function() {
		return this._recipies;
	},

	addRecipe: function(recipe) {
		this._recipies[recipe] = true;

	}


});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingComponent; }
