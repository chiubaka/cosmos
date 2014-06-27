/**
 * Changes the name of a block in the database. Usage: node changeBlockName.js <old_name> <new_name>.
 * @author Daniel Chiu
 */
main(process.argv[2], process.argv[3]);
function main(blockName, newBlockName) {
	var MongoClient = require('mongodb').MongoClient;
	var backupCollection = require('./backupCollection.js');

	MongoClient.connect("mongodb://cosmos-admin:CS210-l3on1ne!@ds030827.mongolab.com:30827/cosmos-dev-db", function(err, db) {
		if (err) {
			console.error("Could not connect to database. " + err);
			process.exit(1);
		}

		console.log("Connected to database.");

		backupCollection(db, 'players', '_backup', function(backup) {
			changeBlockName(db, 'players_backup', blockName, newBlockName, function() {
				db.close();
			});
		});
	});
}

/**
 * Changes the name of a block in the database.
 * @param db {Object} The MongoDB object for this connection.
 * @param collectionName {string} The name of the collection to change the block name in.
 * @param blockName {string} The current name of the block.
 * @param newBlockName {string} The new name of the block.
 * @param callback {function} Callback that is called when the name change is complete.
 */
function changeBlockName(db, collectionName, blockName, newBlockName, callback) {
	db.collection(collectionName, function(err, collection) {
		if (err) {
			console.log("Could not retrieve collection " + collectionName + ". " + err);
			process.exit(1);
		}

		collection.find().toArray(function(err, players) {
			if (err) {
				console.log("Could not retrieve documents from " + collectionName +". " + err);
				process.exit(1);
			}

			var updatesInProgress = 0;
			for (var i = 0; i < players.length; i++) {
				var player = players[i];
				var ship = player.ship;

				for (var row = 0; row < ship.length; row++) {
					var shipRow = ship[row];
					for (var col = 0; col < shipRow.length; col++) {
						if (ship[row][col] === blockName) {
							ship[row][col] = newBlockName;
						}
					}
				}
				player.ship = ship;

				updatesInProgress++;
				collection.update({_id: player._id}, player, function(err, result) {
					if (err) {
						console.log("Error updating modified data. " + err);
						process.exit(1);
					}

					updatesInProgress--;
					if (updatesInProgress === 0) {
						console.log("Block name changed from " + blockName + " to " + newBlockName);
						callback();
					}
				});
			}
		});
	});
}

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = changeBlockName; }
