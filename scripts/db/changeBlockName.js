/**
 * Changes the name of a block in the database. Usage: node changeBlockName.js <old_name> <new_name>.
 * @author Daniel Chiu
 */
var DB = require('./DB.js');

main(process.argv[2], process.argv[3]);
function main(blockName, newBlockName) {
	var db = new DB();
	db.connect(function() {
		db.backupCollection('players', '_backup', function(backupCollection) {
			db.forEachDocumentInCollection(backupCollection,
				function(player) {
					var updatedPlayer = changeBlockName(blockName, newBlockName, player);
					db.update(backupCollection, updatedPlayer, db.close);
				},
				function() {}
			);
		});
	});
}

function changeBlockName(blockName, newBlockName, player) {
	var ship = player.ship;
	var cargo = player.cargo;
	DB.forEachBlockInShip(ship, function(type, x, y) {
		if (type === blockName) {
			DB.placeInShip(ship, newBlockName, x, y);
		}
	});

	DB.forEachBlockInCargo(cargo, function(type, quantity) {
		if (type === blockName) {
			DB.removeFromCargo(cargo, type, quantity);
			DB.placeInCargo(cargo, newBlockName, quantity);
		}
	});

	player.ship = ship;
	player.cargo = cargo;

	return player;
}

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = changeBlockName; }
