/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  var deployDir = grunt.option('destination') || '/var/www/rad-ufu/public/';

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
        bootstrap: {
          src: [
            'node_modules/bootstrap/js/bootstrap-alert.js',
            'node_modules/bootstrap/js/bootstrap-tooltip.js'
          ],
          dest: 'node_modules/bootstrap/bootstrap.js'
        },
        pickadate: {
          src: [
            'node_modules/pickadate/source/pickadate.js',
            'node_modules/pickadate/translations/pickadate.pt_BR.js'
          ],
          dest: 'node_modules/pickadate/pickadate.js'
        }
    },
    min: {
      requirejs: {
        src: 'node_modules/requirejs/require.js',
        dest: 'build/radufu/js/lib/require.js'
      }
    },
    watch: {
    },
    less: {
      style: {
        files: {
          'src/css/style.css': 'src/less/style.less'
        }
      },
      compress: {
        options: {
          yuicompress: true
        },
        files: {
          'build/radufu/css/style.css': 'src/less/style.less'
        }
      }
    },
    copy: {
      setup: {
        files: [
          { src: 'node_modules/FontAwesome/font/*', dest: 'src/font/'}
        ]
      },
      page: {
        files: [
          { src: 'deploy.php', dest: 'build/radufu/index.php'}
        ]
      },
      deploy: {
        files: [
          { src: 'build/radufu/**', dest: deployDir }
        ]
      },
      font: {
        files: [
          { src: 'src/font/*', dest: 'build/radufu/font/'}
        ]
      }
    },
    clean: {
      build: [
        'build'
      ],
      buildfiles: [
        'build/radufu/js/collections',
        'build/radufu/js/models',
        'build/radufu/js/templates',
        'build/radufu/js/util',
        'build/radufu/js/views',
        'build/radufu/js/app.js',
        'build/radufu/js/router.js',
        'build/radufu/js/build.txt'
      ],
      deploy: [
        deployDir + 'css/',
        deployDir + 'font/',
        deployDir + 'js/',
        deployDir + 'index.php'
      ]
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
      ['less:style', 'concat:bootstrap', 'concat:pickadate', 'copy:setup']
    );
  });

  grunt.registerTask('build', 'preparar o projeto para deploy', function () {
    grunt.task.run([
      'clean:build',
      'setup',
      'requirejs:build',
      'min:requirejs',
      'less:compress',
      'copy:page',
      'copy:font',
      'clean:buildfiles'
    ]);
  });

  grunt.registerTask('deploy', 'copiar o build para o backend', function () {
    grunt.task.run([
      'build',
      'clean:deploy',
      'copy:deploy'
    ]);
  });

};
