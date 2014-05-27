var DbSession = {

	playerIdForSession: function(sid, callback) {
		ige.mongo.db.collection('sessions', function(err, sessions) {
			sessions.findOne({_id: sid}, function(err, doc) {
				var session = JSON.parse(doc.session);

				if (session.passport.user && session.passport.user.id) {
					callback(err, session.passport.user.id);
				}
				// Google authentication uses identifier rather than id
				else if (session.passport.user && session.passport.user.identifier) {
					// Google identifier comes back in the format:
					// https://www.google.com/accounts/o8/id?id=<id>
					var identifier = session.passport.user.identifier;
					callback(err, identifier.substring(identifier.indexOf('id=') + 3));
				}
				else {
					callback(err);
				}
			});
		});
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbSession; }
