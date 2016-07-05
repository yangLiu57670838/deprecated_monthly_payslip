module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: ['!app/js/MYOB_Employee_monthly_payslip.js', 'app/**/*.js'],
                dest: 'app/js/<%= pkg.name %>.js'
            },
            css: {
                src: ['app/sass/files/**/*.scss'],
                dest: 'app/sass/main.scss'
            }
        },
        sass: {
            options: {
                sourceMap: true,
				outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'assets/css/main.min.css': 'app/sass/files/test.scss'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				mangle: false
            },
            dist: {
                files: {
                    'assets/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
		watch: {
			js: {
				files: ['!app/js/MYOB_Employee_monthly_payslip.js', 'app/**/*.js'],
				task: ['clean', 'concat', 'uglify']
			},
			css: {
				files: ['app/sass/files/test.scss'],
				task: ['sass']
			}
		},
		clean: {
			build: {
				src: ['app/js/MYOB_Employee_monthly_payslip.js', 'assets/js/MYOB_Employee_monthly_payslip.min.js']
			}
		}
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['clean', 'concat', 'sass', 'uglify']);
};
