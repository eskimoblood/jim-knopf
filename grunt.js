/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://PROJECT_WEBSITE/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'YOUR_NAME; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js']
    },
    concat: {
      dist: {
        src: ['lib/knob.js', 'lib/ui/ui.js', 'lib/ui/ui.el.js'],
        dest: 'dist/knob.js'
      }
    },
    min: {
      dist: {
        src: ['dist/knob.js'],
        dest: 'dist/knob-min.js'
      }
    },
    watch: {
      files: ['lib/**/*.*', 'test/**/*.js', 'grunt.js'],
      tasks: 'concat min buster'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    buster: {
      test: {
        config: 'test/buster.js'
      },
      server: {
        port: 1111
      }
    }
  });

  // BusterJs task.
  grunt.loadNpmTasks('grunt-buster');
  grunt.registerTask('bs', 'buster');

  // Default task.
  grunt.registerTask('default', 'concat min buster');
};
