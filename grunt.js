/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
    },
    min: {
    },
    watch: {
    },
    less: {
      setup: {
        files: {
          'src/css/style.css': 'src/less/style.less',
          'src/css/font.css': 'src/less/font-awesome.less'
        }
      }
    },
    requirejs: {
      build: {
        options: {
          appDir: 'src/js/',
          baseUrl: '.',
          mainConfigFile: 'src/js/main.js',
          modules: [
            { name:'main' }
          ],
          inlineText: true,
          dir: 'build/radufu/js'
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

  grunt.registerTask('setup', 'configurar o projeto para desenvolvimento', function () {
    grunt.task.run(
      ['less:setup']
    );
  });

  grunt.registerTask('build', 'prepar o projeto para deploy', function () {
    grunt.task.run(
      ['requirejs:build']
    );
  })

};
