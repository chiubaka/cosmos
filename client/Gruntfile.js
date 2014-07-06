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
					'public/js/templates.dust.js': 'views/**/*.dust'
				},
				options: {
					wrapper: false,
					runtime: false,
					basePath: 'views'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['compass', 'dust']
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
	grunt.registerTask('default', ['watch']);
}
