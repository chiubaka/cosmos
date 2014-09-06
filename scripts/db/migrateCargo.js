var DB = require('./DB.js');
var _ = require('lodash');

main();


function main() {
	var db = new DB();
	db.connect(function() {
		db.backupCollection('players', '_backup', function(backupCollection) {
			db.forEachDocumentInCollection(backupCollection,
				function(player) {
					var updatedPlayer = migrateCargo(player);
					db.update(backupCollection, updatedPlayer, db.close);
				},
				function() {}
			);
		});
	});
}

function migrateCargo(player) {
	var newCargo = {};
	var oldCargo = player.cargo;

	_.forEach(oldCargo, function(container) {
		_.forOwn(container.containerData, function(quantity, type) {
			newCargo[type] = newCargo[type] || 0;
			newCargo[type] += quantity;
		});
	});

	player.cargo = newCargo;

	return player;
}