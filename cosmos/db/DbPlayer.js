/**
 * Operations on the "players" collection.
 * Loading/saving player state from the database happens here.
 * @class
 * @namespace
 */

var DbPlayer = {
	/**
	 * Loads the player from the database with the specified playerId.
	 * If the player is not in the database, the callback's ship and cargo
	 * arguments are undefined.
	 * @param playerId {string} Unique player identifier. Each player in the
	 * database is indentified by the playerId.
	 * @param callback {onPlayerEntityLoadCallback} First argument to the
	 * callback is the player's ship, second argument is the player's cargo.
	 * @memberof DbPlayer
	 */
	load: function(playerId, callback) {
		ige.mongo.db.collection('players', function(err, players) {
			players.findOne({_id: playerId}, function(err, player) {
				if (player == undefined) {
					callback(err, undefined, undefined);
				}
				else {
					callback(err, player.username, player.ship, player.cargo);
				}
			});
		});
	},

	/**
	 * Updates the player with the specified ID or creates one if one does not
	 * already exist.
	 * @param playerId {string} A unique player identifier.
	 * @param player {Player} The player which we want to update.
	 * @param callback {updatePlayerCallback}
	 * @memberof DbPlayer
	 */
	update: function(playerId, player, callback) {
		if (playerId === undefined) {
			callback(undefined, undefined);
			return;
		}

		ige.mongo.db.collection('players', function(err, players) {
			var username = player.username();
			console.log('Database: ' + username);
			var ship = player.toBlockTypeMatrix();
			var cargo = player.cargo.serializeCargo();
			players.update(
				{_id: playerId},
				{_id: playerId, username: username, ship: ship, cargo: cargo},
				{upsert: true},
				callback
			);
		});
	},

	findByUsername: function(username, callback) {
		if (username === undefined) {
			callback('Username parameter is undefined.', undefined);
			return;
		}

		ige.mongo.db.collection('players', function(err, players) {
			if (err) {
				callback(err, undefined);
				return;
			}

			players.findOne({username: username}, function(err, player) {
				callback(err, player);
			})
		})
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbPlayer; }
