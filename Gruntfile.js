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
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('deploy', ['dust']);
}
