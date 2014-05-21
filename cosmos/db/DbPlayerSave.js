var DbPlayerSave = {
	save: function(player) {
		ige.mongo.connect(function(err, db) {
			ige.mongo.insert('user', {id: 2, username: 'test2', password: 'moo'})
		}
	)},

	serializeGrid: function (grid) {
		// Trim the padding
		var minimumGrid = BlockGridPadding.extractMinimumGrid(grid);
		var serializedGrid = BlockGrid.prototype.serializeGrid(minimumGrid);
		return serializedGrid;
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbPlayerSave; }
