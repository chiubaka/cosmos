var DbPlayerSave = {
	save: function(player, callback) {
		var ship = DbPlayerSave.serializeGrid(player.grid());
		ige.mongo.insert('players', {ship: ship}, function(err, result) {
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

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbPlayerSave; }
