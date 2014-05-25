var DbPlayerLoad = {

	load: function(authToken, callback) {
		ige.mongo.db.collection('players', function(err, players) {
			players.count(function(err, count) {
				// Get a random space ship from the db
				var randomNum = Math.floor((Math.random() * count));
				players.find({},{'limit':-1, 'skip':randomNum}).toArray(function(err, docs) {
					callback(err, docs[0].ship);
				});
			});
		});
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbPlayerLoad; }
