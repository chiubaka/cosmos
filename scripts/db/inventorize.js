/**
 * Move blocks from ship to cargo blocks
 * TODO: makes this use the starter ship in ExampleShips.js.
 */

var starterShipTemplate = 
	[
		[
			null,
			null,
			null,
			null,
			"IronThrusterBlock",
			null,
			null,
			null
		],
		[
			null,
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock"
		],
		[
			"MiningLaserBlock",
			"SteelPlatingBlock",
			"BridgeBlock",
			"PowerBlock",
			"CargoBlock",
			"CargoBlock",
			"FuelBlock",
			"IronEngineBlock"
		],
		[
			null,
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock",
			"SteelPlatingBlock"
		],
		[
			null,
			null,
			null,
			null,
			"IronThrusterBlock",
			null,
			null,
			null
		]
	]

var cargoContainerTemplate =
	{
		"containerMeta": {
			"numSlots": 64
		},
		"containerData": {
		}
	}

main();
function main() {
	var MongoClient = require('mongodb').MongoClient;
	var backupCollection = require('./backupCollection.js');

	MongoClient.connect("mongodb://cosmos-admin:CS210-l3on1ne!@ds030827.mongolab.com:30827/cosmos-dev-db", function(err, db) {
		if (err) {
			console.error("Could not connect to database. " + err);
			process.exit(1);
		}

		console.log("Connected to database.");

		backupCollection(db, 'players', '_inventorize', function(backup) {
			inventorize(db, 'players_inventorize', function() {
				db.close();
			});
		});
	});
}

/**
 * Changes the name of a block in the database.
 * @param db {Object} The MongoDB object for this connection.
 * @param collectionName {string} The name of the collection to change the block name in.
 * @param callback {function} Callback that is called when the name change is complete.
 */
function inventorize(db, collectionName, callback) {
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
				var cargo = player.cargo;

				// Get a catalog of what blocks are on the ship
				var shipBlocks = {};
				for (var row = 0; row < ship.length; row++) {
					var shipRow = ship[row];
					for (var col = 0; col < shipRow.length; col++) {
						var block = ship[row][col];
						// Increment count for the ship block catalog
						shipBlocks[block] = (shipBlocks[block] || 0) + 1;
					}
				}

				// Delete pesky null blocks because we don't want to insert them into
				// the cargo
				delete shipBlocks['null'];

				// If the cargo has no cargo containers, add an empty one
				if (cargo[0] === undefined) {
					cargo.push(cargoContainerTemplate);
				}

				// Put ship blocks into cargo.
				// Note: This does not respect cargo container size
				var containerData = cargo[0].containerData;
				for (var block in shipBlocks) {
					if (shipBlocks.hasOwnProperty(block)) {
						containerData[block] = (containerData[block] || 0) +
							shipBlocks[block];
					}
				}

				// Give the player the default ship
				player.ship = starterShipTemplate;
				player.cargo = cargo;

				updatesInProgress++;
				collection.update({_id: player._id}, player, function(err, result) {
					if (err) {
						console.log("Error updating modified data. " + err);
						process.exit(1);
					}

					updatesInProgress--;
					if (updatesInProgress === 0) {
						console.log("Moved ship blocks into cargo!");
						callback();
					}
				});
			}
		});
	});
}

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = inventorize; }
