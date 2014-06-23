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

			console.log(docs.length);

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
