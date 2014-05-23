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

	init: function() {
		var module_path = '../../node_modules/mongodb'
		this.Db = require(module_path).Db;
		this.Server = require(module_path).Server;
		this.MongoClient = require(module_path).MongoClient;
		this.Collection = require(module_path).Collection;
	},

	connect: function (callback) {
		var self = this;

		// Build mongoDB URI string
		var format = require('util').format;
		var username = encodeURIComponent(this.config.username);
		var password = encodeURIComponent(this.config.password);
		var formatString = 'mongodb://%s:%s@%s:%s/%s'
		var uri = format(formatString, username, password, this.config.host,
			this.config.port, this.config.dbName);

		// Connect to MongoDB server
		var opts = {uri_decode_auth: true, native_parser: true};
		this.MongoClient.connect(uri, opts, function(err, db) {
			// TODO: Use IGE component and logging system
			assert.equal(err, null, "DB connect error");
			self.db = db;
			callback()
		});
	},

	disconnect: function () {
		this.db.close();
	}

};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbConfig; }
