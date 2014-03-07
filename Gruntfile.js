/* global module, require */
/* jshint indent:2 */
module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'nice-package': {
      all: {
        options: {
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      'default': {
        src: ['Gruntfile.js', '*.js']
      }
    },

    'gh-pages': {
      src: [
        'index.html',
        'README.md',
        '*.js',
        'vendor/*'
      ]
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['nice-package', 'jshint']);
};
