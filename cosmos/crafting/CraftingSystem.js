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
		var player, cargo;

		console.log("Player '" + clientId + "' wants to craft: '" + data + "'");
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



	},
	

});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = CraftingSystem; }
