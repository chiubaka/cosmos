module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			dist: {
				options: {
					sassDir: 'client/sass',
					cssDir: 'client/public/stylesheets'
				}
			}
		},
		dust: {
			dist: {
				files: {
					'client/public/js/templates.dust.js': 'client/views/**/*.dust'
				},
				options: {
					wrapper: false,
					runtime: false,
					basePath: 'client/views'
				}
			}
		},
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
						'cosmos/tests/**/*.js'
					],
					plugins: [
						'karma-jasmine',
						'karma-phantomjs-launcher',
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
				cmd: 'cd ige; node server/ige.js -deploy ../cosmos -to ../cosmos/tests ' +
					'-clear true -clearClasses false'
			}
		},
		jsbeautifier: {
			test: {
				src: ['cosmos/tests/game.js']
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['compass', 'dust']
			},
			dust: {
				files: 'client/views/**/*.dust',
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
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('deploy', ['dust']);
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
};
