module.exports = function (grunt) {

	var path = require('path');
	var fs = require('fs');

	var buildPath = grunt.option('build-path') || 'build';
	var tempPath = grunt.option('temp-path') || 'temp';
	var uploader = grunt.option('uploader') || 'default';
	var filesToUpload = grunt.option('filesToUpload') || '';

	var s3Key = '<%= s3Key %>';
	var s3Secret = '<%= s3Secret %>';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		buildPath: buildPath,
		tempPath: tempPath,
		uploader: uploader,
		filesToUpload: filesToUpload.split(','),

		//cleans output folder
		clean: {
			build: {
				src: ['<%%= buildPath%>']
			},
			temp: {
				src: ['<%%= tempPath%>']
			},
			buildImgsAndCss: {
				src: ['<%%= buildPath%>/sources/css/', '<%%= buildPath%>/sources/images/', '<%%= buildPath%>/sources/fonts/'] /* if there are big images you have remove the 2nd element from array */
			}
		},

		// analyzes the js code
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					'jQuery': true,
					'responsify': true,
					'RD': true,
					'jQ': true,
					'Mdr': true,
					'$': true,
					'console': true,
					'iScroll': true
				}
			},
			sources: {
				src: ['./sources/js/*.js']
			}
		},

		// concatenates javascript files
		concat: {
			js: {
				options: {
					banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
						'<%%= grunt.template.today("yyyy-mm-dd HH:MM") %> ' +
						'uploaded by: <%%= uploader %> */ \n'
				},
				src: ['./sources/js/**/*.js', '<%%= tempPath %>/templates.js'],
				dest: '<%%= buildPath %>/sources/js/clientMap.js'
			},
			cssIntoJs: {
				options: {
					process: function (src, filepath) {
						return "RD.clientCssManager.set('" + filepath.replace(buildPath + "/sources", "..") + "','" + src + "');"
					}
				},

				src: '<%%= buildPath %>/sources/css/**/*.css',
				dest: '<%%= tempPath %>/cssSources.js'
			},
			jsAndCss: {
				options: {
					banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
						'<%%= grunt.template.today("yyyy-mm-dd HH:MM") %> ' +
						'uploaded by: <%%= uploader %> */ \n'
				},

				src: ['<%%= buildPath %>/sources/js/clientMap.js', '<%%= tempPath %>/cssSources.js'],
				dest: '<%%= buildPath %>/sources/js/clientMap.js'
			},
			clientMapAndTemplates: {
				options: {
					banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
						'<%%= grunt.template.today("yyyy-mm-dd HH:MM") %> ' +
						'uploaded by: <%%= uploader %> */ \n'
				},
				src: ['./sources/js/libs/**/*.js', '<%%= tempPath %>/templates.js', './sources/js/clientMap.js'],
				dest: '<%%= buildPath %>/sources/js/clientMap.js'
			}
		},

		copy: {
			css: {
				files: [
					{ src: ['*'], cwd: './sources/css/', dest: '<%%= buildPath %>/sources/css/', expand: true }
				]
			},
			images: {
				files: [
					{ src: ['*'], cwd: './sources/images/', dest: '<%%= buildPath %>/sources/images/', expand: true }
				]
			},
			fonts: {
				files: [
					{ src: ['*'], cwd: './sources/fonts/', dest: '<%%= buildPath %>/sources/fonts/', expand: true }
				]
			},
			js: {
				files: [
					{ src: ['*'], cwd: './sources/js/', dest: '<%%= buildPath %>/sources/js/', expand: true }
				]
			},
			partialCss: {
				files: [
					{ src: '<%%= filesToUpload %>', cwd: './sources/css/', dest: '<%%= buildPath %>/sources/css/', expand: true }
				]
			},
			partialJs: {
				files: [
					{ src: '<%%= filesToUpload %>', cwd: './sources/js/', dest: '<%%= buildPath %>/sources/js/', expand: true }
				]
			}
		},

		//minifies javascript files
		uglify: {
			options: {
				banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' + '<%%= grunt.template.today("yyyy-mm-dd HH:MM") %> */'
			},
			clientmap: {
				files: {
					'<%%= buildPath %>/sources/js/clientMap.js': ['<%%= buildPath %>/sources/js/clientMap.js']
				}
			}
		},

		// minifies css
		cssmin: {
			css: {
				expand: true,
				cwd: './<%%= buildPath %>/sources/css/',
				src: ['**/*.css'],
				dest: '<%%= buildPath %>/sources/css/'
			}
		},

		handlebars: {
			compile: {
				options: {
					namespace: "RD.templates",
					processContent: function (content) {
						content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
						content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
						return content;
					},
					processName: function (filename) {
						return path.basename(filename, '.hbs');
					}
				},
				files: {
					'<%%= tempPath %>/templates.js': ['sources/templates/*.hbs']
				}
			}
		},

		less: {
			qa: {
				files: [
					{
						expand: true,
						cwd: 'sources/less',
						src: ['*.less'],
						dest: '<%%= buildPath %>/sources/css/',
						ext: '.css'
					}
				]
			},
			prod: {
				options: {
					cleancss: true
				},
				files: [
					{
						expand: true,
						cwd: 'sources/less',
						src: ['*.less'],
						dest: '<%%= buildPath %>/sources/css/',
						ext: '.css'
					}
				]
			}
		},

		// s3 management
		s3: {
			options: {
				key: '<%%= s3Key %>',
				secret: '<%%= s3Secret %>',
				bucket: 'responsive-qa',
				access: 'bucket-owner-full-control',
				maxOperations: 10,
				gzip: true
			},
			dev: {
				upload: [
					{
						src: '<%%= buildPath %>/**/*',
						dest: '<%= projectName %>/<%%= uploader%>/',
						rel: '<%%= buildPath %>'
					}
				]
			},
			qa: {
				upload: [
					{
						src: '<%%= buildPath %>/**/*',
						dest: '<%= projectName %>/',
						rel: '<%%= buildPath %>'
					}
				]
			},
			prod: {
				upload: [
					{
						src: '<%%= buildPath %>/**/*',
						dest: '<%= projectName %>/',
						rel: '<%%= buildPath %>'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-s3');
	grunt.loadNpmTasks("grunt-image-embed");
	grunt.loadNpmTasks('grunt-contrib-less');

	var buildTask = ['jshint', 'clean:build', 'clean:temp', 'handlebars', 'concat:js', 'copy:images', 'copy:fonts', 'copy:css', 'less:qa', 'img2base64'],
		devTask = buildTask.concat('s3:dev'),
		qaTask = buildTask.concat('s3:qa'),
		prodTask = buildTask.concat('cssmin:css', 'concat:cssIntoJs', 'concat:jsAndCss', 'uglify:clientmap', 'clean:buildImgsAndCss', 's3:prod'),
		qaPrepPartial = ['jshint', 'clean:build', 'clean:temp', 'handlebars', 'copy:images', 'copy:fonts', 'copy:css', 'copy:js', 'concat:clientMapAndTemplates', 's3:qa'],
		qaPartial = ['jshint', 'clean:build', 'clean:temp', 'copy:partialCss', 'copy:partialJs', 's3:qa'];

	//tricky way to execute imageEmbed separately for each file
	grunt.registerTask('img2base64', function () {
		var dirPath = buildPath + "/sources/css/",
			files = fs.readdirSync(dirPath),
			imageEmbed = {};

		files.forEach(function (path) {
			var filePath = dirPath + path;
			imageEmbed[path] = {
				src: [filePath],
				dest: filePath,
				options: {
					maxImageSize: 32000,
					deleteAfterEncoding: false
				}
			};
		});

		grunt.config("imageEmbed", imageEmbed);
		grunt.task.run("imageEmbed");
	});

	// build tasks
	grunt.registerTask('build', buildTask);

	// dev tasks
	grunt.registerTask('dev', devTask);

	// qa tasks
	grunt.registerTask('qa', qaTask);

	// prod tasks
	grunt.registerTask('prod', prodTask);

	// qa prepare partial upload task
	grunt.registerTask('prepqapartial', qaPrepPartial);

	// qa partial upload task
	grunt.registerTask('qapartial', qaPartial);
};