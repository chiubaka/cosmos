/**
 * Creates a backup collection of the specified collection in the database.
 * @param db {Object} The MongoDB object for this database connection.
 * @param collectionName {string} The name of the collection to backup.
 * @param suffix {string} The string suffix to append to the name of the collection when creating the backup collection.
 * @param callback {function} Callback to call when the backup is done. Passes in the backup collection object.
 */
function backupCollection(db, collectionName, suffix, callback) {
	console.log("Backing up collection " + collectionName + ".");
	db.collection(collectionName, function(err, collection) {
		if (err) {
			console.error("Could not retrieve collection " + collectionName + ". " + err);
			process.exit(1);
		}

		collection.find().toArray(function(err, docs) {
			if (err) {
				console.error("Could not convert documents into array. " + err);
				process.exit(1);
			}

			db.createCollection(collectionName + suffix, function(err, backup) {
				if (err) {
					console.error("Could not create backup collection " + collectionName + suffix + ". " + err);
					process.exit(1);
				}

				backup.insert(docs, function(err) {
					if (err) {
						console.error("Could not copy documents into backup collection: " + err);
						process.exit(1);
					}

					console.log("Backed up collection " + collectionName + ".");
					callback(backup);
				});
			});
		});
	});
}

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = backupCollection; }
