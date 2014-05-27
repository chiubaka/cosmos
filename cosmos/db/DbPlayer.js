var DbPlayer = {

	load: function(authToken, callback) {
		ige.mongo.db.collection('players', function(err, players) {
			players.count(function(err, count) {
				// Get a random space ship from the db
				var randomNum = Math.floor((Math.random() * count));
				players.find({},{'limit':-1, 'skip':randomNum}).toArray(function(err, docs) {
					// Go back to player creation
					callback(err, docs[0].ship, docs[0].cargo);
				});
			});
		});
	},

	save: function(player, callback) {
		var ship = DbPlayer.serializeGrid(player.grid());
		var cargo = player.cargo.serializeCargo();
		ige.mongo.insert('players', {ship: ship, cargo: cargo}, function(err, result) {
			callback(err, result);
		});
	},

	serializeGrid: function (grid) {
		// Trim the padding
		var minimumGrid = BlockGridPadding.extractMinimumGrid(grid);
		var serializedGrid = BlockGrid.prototype.serializeGrid(minimumGrid);
		return serializedGrid;
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbPlayer; }
