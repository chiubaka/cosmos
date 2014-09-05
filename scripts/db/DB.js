var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');

var DB = function() {
	var _db;
	var _updatesInProgress = 0;
	var _closeInterval;

	this.backupCollection = function(collectionName, suffix, callback) {
		console.log("Backing up collection " + collectionName + ".");
		var backupName = collectionName + suffix;
		_db.collection(collectionName, function(err, collection) {
			if (err) {
				console.error("DB#backupCollection: Could not retrieve " +
					"collection " + collectionName + ": " + err);
				process.exit(1);
			}

			collection.find().toArray(function(err, docs) {
				if (err) {
					console.error("DB#backupCollection: Could not convert documents " +
						"into array: " + err);
					process.exit(1);
				}

				_db.createCollection(backupName, function(err, backup) {
					if (err) {
						console.error("DB#backupCollection: Could not create backup " +
							"collection " + backupName + ": " + err);
						process.exit(1);
					}

					backup.insert(docs, function(err) {
						if (err) {
							console.error("DB#backupCollection: Could not copy documents " +
								"into backup collection: " + err);
							process.exit(1);
						}

						console.log("DB#backupCollection: Backed up collection " +
							collectionName + " to " + backupName + ".");
						callback(backup);
					});
				});
			});
		});
	};

	this.close = function() {
		if (!_closeInterval) {
			_closeInterval = setInterval(function() {
				if (_updatesInProgress === 0) {
					_db.close();
					clearInterval(_closeInterval);
					_closeInterval = undefined;
				}
			}, DB.RETRY_INTERVAL);
		}
	};

	this.connect = function(callback) {
		MongoClient.connect(DB.URL, function(err, db) {
			if (err) {
				console.error("DB#connect: Could not connect to database: " +
					err);
				process.exit(1);
			}

			_db = db;

			console.log("DB#connect: Connected to database.");

			callback();
		});
	};

	this.forEachDocumentInCollection = function(collection, action, callback) {
		collection.find().toArray(function(err, documents) {
			if (err) {
				console.error("DB#collectionForEach: Could not retrieve documents " +
					"from " + collection.collectionName + ": " + err);
				process.exit(1);
			}

			_.forEach(documents, action);

			callback();
		});
	};

	this.openCollection = function(collectionName, callback) {
		db.collection(collectionName, function(err, collection) {
			if (err) {
				console.error("DB#openCollection: Could not retrieve collection " +
					collectionName + ": " + err);
				process.exit(1);
			}

			callback(collection);
		});
	};

	this.update = function(collection, doc, callback) {
		_updatesInProgress++;

		collection.update({_id: doc._id}, doc, function(err, result) {
			if (err) {
				console.error("DB#update: Error updating collection " +
					collection.collectionName + ": " + err);
				process.exit(1);
			}

			_updatesInProgress--;
			callback();
		});
	};
};

DB.forEachBlockInCargo = function(cargo, action) {
	var copy = JSON.parse(JSON.stringify(cargo));

	_.forOwn(copy, function(quantity, type) {
		action(type, quantity);
	});
};

DB.forEachBlockInShip = function(ship, action) {
	var copy = JSON.parse(JSON.stringify(ship));

	for (var row = 0; row < copy.length; row++) {
		var copyRow = copy[row];
		for (var col = 0; col < copyRow.length; col++) {
			action(copy[row][col], col, row);
		}
	}
};

DB.placeInCargo = function(cargo, type, quantity) {
	cargo[type] = cargo[type] || 0;
	cargo[type] += quantity;
};

DB.placeInShip = function(ship, type, x, y) {
	ship[y][x] = type;
};

DB.removeFromCargo = function(cargo, type, quantity) {
	// If type is not a property of the cargo, then none of this type is in the
	// cargo anyway so return.
	if (!cargo[type]) {
		return;
	}

	cargo[type] -= quantity;

	// If the quantity would now be less than or equal to 0, we don't need an
	// entry so delete it.
	if (cargo[type] <= 0) {
		delete cargo[type];
	}
};

DB.URL = "mongodb://cosmos-admin:CS210-l3on1ne!@ds030827.mongolab.com:30827/" +
	"cosmos-dev-db";

/**
 * Time between retries of an operation in ms.
 * @type {number}
 */
DB.RETRY_INTERVAL = 1000;

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DB;
}
