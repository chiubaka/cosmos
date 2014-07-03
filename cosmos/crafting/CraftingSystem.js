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

	craftClient: function(recipe) {
		ige.network.send('cosmos:crafting.craft', recipe);
	},

	_craftServer: function (data, clientId) {
		var player, cargo, cargoItems;
		var recipe = data;

		console.log("Player '" + clientId + "' wants to craft: '" + data + "'");

		// Check if player and player cargo exist
		player = ige.server.players[clientId];
		if (player === undefined) {
			this.log('CraftingSystem._craftServer: Player is undefined', 'error');
			return;
		}
		cargo = player.cargo;
		if (cargo === undefined) {
			this.log('CraftingSystem._craftServer: Cargo is undefined', 'error');
			return;
		}

		cargoItems = cargo.getItemList(true);
		if (this.canCraft(cargoItems, player, recipe)) {
			console.log('Craftable');
			this.doCraft();
		};

	},
	
	/**
	* @param cargoItems {Object}
	* @param player {Player}
	* @param recipe {Object}
	* @returns {Boolean}
	*/
	canCraft: function(cargoItems, player, recipe) {
		return false;
	},



	doCraft: function(cargo, recipe) {
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingSystem; }
