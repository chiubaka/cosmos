var DbConfig = {
	db: {
		type: 'mongo',
		host: 'ds030827.mongolab.com',
		port: '30827',
		user: 'cosmos-admin',
		pass: 'CS210-l3on1ne!',
		dbName: 'cosmos-dev-db'
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbConfig; }
