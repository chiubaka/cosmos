module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		karma: {
			unit: {
				options: {
					singleRun: true,
					reporters: ['spec'],
					files: [
						'client/public/vendor/lodash/lodash.min.js',
						'cosmos/tests/TestUtils.js',
						'cosmos/tests/config.js',
						'cosmos/tests/game.js',
						'cosmos/tests/igeSetup.js',
						'cosmos/tests/Grid.test.js',
						'cosmos/tests/**/*.js'
					],
					plugins: [
						'karma-jasmine',
						'karma-phantomjs-launcher',
						'karma-chrome-launcher',
						'karma-safari-launcher',
						'karma-firefox-launcher',
						'karma-spec-reporter'
					],
					frameworks: [
						'jasmine'
					],
					browsers: [
						'PhantomJS'
					]
				}
			}
		},
		exec: {
			ige_deploy: {
				cmd: 'cd ige; node server/ige.js --deploy ../cosmos --to ../cosmos/tests ' +
					'--clear true --clearClasses false'
			}
		},

		jsbeautifier: {
			test: {
				src: ['cosmos/tests/game.js']
			}
		}
	});
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.registerTask('test', 'Runs tests for Cosmos.', function() {
		if (grunt.option('no-compile') || grunt.option('nc')) {
			grunt.task.run(['karma:unit']);
		}
		else {
			grunt.task.run([
				'exec:ige_deploy',
				//'jsbeautifier:test',
				'karma:unit'
			]);
		}
	});
	grunt.registerTask('preview', 'Runs the Cosmos game server as preview',
		function() {
		var done = this.async();
		var pm2 = require('pm2');
		pm2.connect(function(err) {
			var gameServerPath = 'ige/server/ige.js';
			var gameServerOpts = {
				name: 'cosmos_game_server',
				scriptArgs: ['--preview', '-g', 'cosmos'],
				error: 'logs/error.log',
				output: 'logs/output.log'
			};
			pm2.start(gameServerPath, gameServerOpts, function(err, proc) {
				if(err) throw new Error('err');
				done();
			});
		});
	});

	grunt.registerTask('default', ['test']);
};
