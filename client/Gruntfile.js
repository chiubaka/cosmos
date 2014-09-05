module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			dist: {
				options: {
					sassDir: 'sass',
					cssDir: 'public/stylesheets'
				}
			}
		},
		dust: {
			dist: {
				files: {
					'client/public/js/templates.dust.js': 'views/**/*.dust'
				},
				options: {
					wrapper: false,
					runtime: false,
					basePath: 'views'
				}
			}
		},
		production: {
			// Command to minify and pack game into one JS file
			local: {
				minifyCommand: 'node server/ige.js --deploy ../cosmos --to ' +
				 '../client/public/js/cosmos --clear true --clearClasses false',
				expressServerArgs: '--local'
			},
			dev: {
				minifyCommand: 'node server/ige.js --deploy ../cosmos --to ' +
				 '../client/public/js/cosmos --clear true --clearClasses false',
				expressServerArgs: '--dev'
			},
			preview: {
				minifyCommand: 'node server/ige.js --deploy ../cosmos --to ' +
				 '../client/public/js/cosmos',
				expressServerArgs: '--preview'
			},
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['compass']
			},
			dust: {
				files: 'views/**/*.dust',
				tasks: ['dust']
			},
			options: {
				atBegin: true
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-dust');

	// Runs the compass, dust tasks and runs the Cosmos express server
	grunt.registerMultiTask('production', 'Run the Cosmos express server in' +
		'production (either dev or preview)', function() {
		// Compile sass and dust templates
		// TODO: grunt.task.run doesn't provide a callback so these tasks end up
		// running last. Fix this when grunt is updated
		grunt.task.run(['compass', 'dust']);
		var done = this.async();
		var self = this;
		var pm2 = require('pm2');
		var exec = require('child_process').exec;

		// Pack and uglify game into one JS file
		exec(this.data.minifyCommand, {cwd: '../ige'}, function(err, stdout, stderr){
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (err !== null) {
				console.log('exec error: ' + err);
			}
			startExpressServer();
		});

		// Start express server
		function startExpressServer() {
			pm2.connect(function(err) {
				var expressServerPath = 'server.js';
				var expressServerOpts = {
					name: 'cosmos_express_server',
					scriptArgs: [self.data.expressServerArgs],
					error: 'logs/error.log',
					output: 'logs/output.log'
				};
				pm2.start(expressServerPath, expressServerOpts, function(err, proc) {
					if(err) throw new Error('err');
					done();
				});
			});
		}
	});

	// By default, auto compile sass and dust templates
	grunt.registerTask('default', ['watch']);
};
