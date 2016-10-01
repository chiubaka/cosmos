/**
 * Contains information needed for connecting to our MongoDB server
 * Keep this secret!
 */
var DbConfig = {
	db: undefined,

	config: {
		user: 'cosmos-admin',
		pass: 'CS210-l3on1ne!',
		host: 'ds046939.mlab.com',
		port: '46939',
		dbName: 'cosmos-dev-db',
		collection: 'players'
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbConfig; }
