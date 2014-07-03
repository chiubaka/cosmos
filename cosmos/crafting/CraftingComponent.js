/* Crafting component
 * This component is meant to be initialized client-side and server-side.
 */

var CraftingComponent = IgeEventingClass.extend({
	classId: 'CraftingComponent',
	componentId: 'crafting',

	_cargo: undefined,
	// TODO: Load unlocked recipies from DB. For now, we have a predefined set of
	// recipies.
	_recipies: undefined,

	init: function(entity, options) {
		// TODO: Client side crafting should have an idea of the cargo. This allows
		// uncraftable things to be grayed out. Pending cargo refactor
		if (ige.isServer) {
			if (entity.cargo === undefined) {
				this.log('Player cargo has not been initialized.', 'error');
			}
			this._cargo = entity.cargo;

			// Define network commands server side
			ige.network.define('cosmos:crafting.craft', this.craft);
		}
		this._recipies = Recipies.starterRecipies;

	},

	craft: function(recipe) {
		if (ige.isClient) {
			ige.network.send('cosmos:crafting.craft', recipe);
		}

		if (ige.isServer) {
			console.log(recipe);
		}

	}
	

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingComponent; }
