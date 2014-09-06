/**
 * Operations on the "players" collection.
 * Loading/saving player state from the database happens here.
 * @class
 * @namespace
 */

var DbPlayer = {
	// Indicates whether or not we should update the DB when update() is called
	_noUpdate: false,

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
					callback(err, undefined, undefined, undefined);
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
		// Don't save players who are not logged in
		// Don't save when _noUpdate is true
		if ((player.loggedIn() === false) || this._noUpdate) {
			callback(undefined, undefined);
			return;
		}

		ige.mongo.db.collection('players', function(err, players) {
			// If this logged in player has a guest username, don't save it to the
			// database. This way, we'll prompt them to set a username again next
			// time they log in.
			var username = player.hasGuestUsername ? undefined : player.username();
			var lowerCaseUsername = player.hasGuestUsername ? undefined : username.toLowerCase();

			var ship = player.currentShip().toBlockTypeMatrix();
			var cargo = player.currentShip().cargo.toJSON();

			players.update(
				{_id: playerId},
				{_id: playerId, username: username, lowerCaseUsername: lowerCaseUsername, ship: ship, cargo: cargo},
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

		// Usernames are case insensitive for search purposes
		username = username.toLowerCase();

		ige.mongo.db.collection('players', function(err, players) {
			if (err) {
				callback(err, undefined);
				return;
			}

			players.findOne({lowerCaseUsername: username}, function(err, player) {
				callback(err, player);
			})
		})
	},

	// Makes update() a no-op. This is useful when loading a player from the DB.
	// We don't want to update the DB when loading the player because if the
	// loading is interrupted, the player's incomplete ship and cargo may be
	// saved to the DB.
	noUpdate: function(context, doWork, opts) {
		this._noUpdate = true;
		doWork.apply(context, opts);
		this._noUpdate = false;
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbPlayer; }
