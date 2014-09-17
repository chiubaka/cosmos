/**
 * Operations on the "sessions" collection.
 * Each document contains the session id, the session cookie, and the
 * expiry date of the session.
 * @class
 * @namespace
 */
var DbSession = {
	/**
	 * Given a session id, finds the corresponding player id in the
	 * "sessions" collection.
	 * @param sid {string} Session id of the client
	 * @param callback {onPlayerEntitySessionCallback}
	 */
	playerIdForSession: function(sid, callback) {
		if (sid === undefined) {
			callback();
		}
		ige.mongo.db.collection('sessions', function(err, sessions) {
			sessions.findOne({_id: sid}, function(err, doc) {
				if (err || doc === undefined) {
					callback(err);
				}
				var session = JSON.parse(doc.session);

				if (session.passport && session.passport.user && session.passport.user.id) {
					callback(err, session.passport.user.id);
				} else {
					callback(err);
				}
			});
		});
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {
	module.exports = DbSession; }
