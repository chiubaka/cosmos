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
				//db.close();
			});
		});
	});
}

function changeBlockName(db, collectionName, blockName, newBlockName, callback) {
	console.log(collectionName);

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
				collection.update({_id: player._id}, player, function(err, result) {
					if (err) {
						console.log("Error updating modified data.");
						process.exit(1);
					}

					callback();
				});
			}
		});
	});
}

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = changeBlockName; }
