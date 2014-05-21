var DbPlayerLoad = {
	load: function(authToken) {
		ige.mongo.connect(function(err, db) {
			//ige.mongo.insert('user', {id: 2, username: 'test2', password: 'moo'})
		}
	)}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbPlayerLoad; }
