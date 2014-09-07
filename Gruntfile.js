module.exports = function (grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		connect : {
			server : {
				options : {
					port : 8080
				,	base : '.'
				// ,	keepalive: true
				}
			}
		}

	,	watch : {
			uglify: {
				files : 'src/**/*.js'
			}
		}

	,	uglify: {
			all: {
				options: {
					sourceMap: true,
					sourceMapName: 'src/all.min.map'
				},
				files: {
					'src/all.min.js': 'src/css-extractor.js'
				}
			}
		}


	});

	grunt.registerTask('run', [ 'uglify', 'connect', 'watch']);
};





