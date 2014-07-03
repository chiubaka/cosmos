/**
 * Contains information needed for connecting to our MongoDB server
 * Keep this secret!
 */
var DbConfig = {
	db: undefined,

	origonfig: {
		user: 'cosmos-admin',
		pass: 'CS210-l3on1ne!',
		host: 'ds030827.mongolab.com',
		port: '30827',
		dbName: 'cosmos-dev-db',
		collection: 'players'
	},

	config: {
		host: 'localhost',
		port: '27017',
		dbName: 'cosmos-dev-db',
		collection: 'players'
	},

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbConfig; }
