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
		// TODO: Give canCraft a list of ship blocks instead of the whole player
		if (this.canCraft(cargoItems, player, recipe)) {
			console.log('Craftable');
			this.doCraft();
		};

	},
	
	/**
	* @returns {Boolean}
	*/
	canCraft: function(cargoItems, playerBlockGrid, recipe) {
		return fals
	},

	doCraft: function(cargo, recipe) {
	}

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingSystem; }
