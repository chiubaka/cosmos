var DbPlayerLoad = {

	load: function(authToken, callback) {
		var self = this;
		// TODO: Remove excess callbacks, use the correct find function,

		ige.mongo.db.collection('players', function(err, players) {
			players.count(function(err, count) {
				console.log(count);
				// Get a random space ship from the db
				var randomNum = Math.floor((Math.random() * count));
				players.find({},{'limit':-1, 'skip':randomNum}, function (err, cursor) {
					cursor.toArray(function(err, docs) {
						var x = docs;
						// TODO: Find out why doc and err works when reversed
						docs.each(function(doc, err) {
							console.log(doc);
							callback.apply(self, [err, doc.ship]);
						});
					});
				});
			});
		});
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbPlayerLoad; }
