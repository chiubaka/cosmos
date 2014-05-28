var DbSession = {

	playerIdForSession: function(sid, callback) {
		ige.mongo.db.collection('sessions', function(err, sessions) {
			sessions.findOne({_id: sid}, function(err, doc) {
				var session = JSON.parse(doc.session);

				if (session.passport.user && session.passport.user.id) {
					callback(err, session.passport.user.id);
				}
					callback(err);
				}
			});
		});
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbSession; }
