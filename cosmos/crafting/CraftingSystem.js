/* Crafting system
 * This is an IGE system
 * This system is meant to be initialized client-side and server-side.
 */

var CraftingSystem = IgeEventingClass.extend({
	classId: 'CraftingSystem',
	componentId: 'craftingSystem',


	init: function(entity, options) {
		if (ige.isServer) {
			ige.network.define('cosmos:crafting.craft', this.craft);
		}
		this.log('Crafting system initiated!');
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
	module.exports = CraftingSystem; }
