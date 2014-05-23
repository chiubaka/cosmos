var DbConfig = {
	db: undefined,

	config: {
		user: 'cosmos-admin',
		pass: 'CS210-l3on1ne!',
		host: 'ds030827.mongolab.com',
		port: '30827',
		dbName: 'cosmos-dev-db',
		collection: 'players'
	},

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbConfig; }
