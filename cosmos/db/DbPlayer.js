var DbPlayer = {

	load: function(playerId, callback) {
		ige.mongo.db.collection('players', function(err, players) {
			players.findOne({_id: playerId}, function(err, player) {
				if (player == undefined) {
					callback(err, undefined, undefined);
				}
				else {
					callback(err, player.ship, player.cargo);
				}
			});
		});
	},

	/**
	 * Updates the player with the specified ID or creates one if one does not
	 * already exist.
	 * @param playerId
	 * @param player
	 * @param callback
	 */
	update: function(playerId, player, callback) {
		if (playerId === undefined) {
			callback(undefined, undefined);
			return;
		}

		ige.mongo.db.collection('players', function(err, players) {
			var ship = DbPlayer.serializeGrid(player.grid());
			var cargo = player.cargo.serializeCargo();
			players.update(
				{_id: playerId},
				{_id: playerId, ship: ship, cargo: cargo},
				{upsert: true},
				callback
			);
		});
	},

	// TODO: This is really the BlockGrid's responsibility
	serializeGrid: function (grid) {
		// Trim the padding
		var minimumGrid = BlockGridPadding.extractMinimumGrid(grid);
		var serializedGrid = BlockGrid.prototype.serializeGrid(minimumGrid);
		return serializedGrid;
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbPlayer; }