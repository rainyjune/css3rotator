module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      slider: {
        files: {
          'dist/js/slider.min.js': ['src/js/slider.js']
        }
      }
    },
    cssmin: {
      slider: {
        files: {
          'dist/css/slider.min.css': ['src/css/slider.css']
        }
      }
    },
    watch: {
      'jsFiles': {
        files: ['src/js/slider.js'],
        tasks: ['uglify']
      },
      'cssFiles': {
        files: ['src/css/slider.css'],
        tasks: ['cssmin']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};
