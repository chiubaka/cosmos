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
				background: true,
				options: {
					files: [
						'cosmos/tests/**/*.js'
					],
					plugins: [
						'karma-jasmine',
						'karma-phantomjs-launcher'
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
			},
			karma: {
				files: ['cosmos/tests/**/*.js'],
				tasks: ['karma:unit:run']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-dust');
	grunt.loadNpmTasks('grunt-karma');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('deploy', ['dust']);
}
