/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  var deployDir = grunt.option('destination') || '/var/www/rad-ufu/public/';
  var commitHash = 'none';

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
    uglify: {
      requirejs: {
        files: {
          'build/radufu/js/lib/require.js': ['node_modules/requirejs/require.js']
        }
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
          { expand:true, cwd: 'node_modules/FontAwesome/font/', src: ['*'], dest: 'src/font/'}
        ]
      },
      page: {
        files: [
          { src: 'deploy.processed.php', dest: 'build/radufu/index.php'}
        ]
      },
      deploy: {
        files: [
          { expand: true, cwd: 'build/radufu', src:['**'], dest: deployDir }
        ]
      },
      font: {
        files: [
          { expand: true, cwd: 'src/font', src: ['*'], dest: 'build/radufu/font/'}
        ]
      }
    },
    clean: {
      options: {
        force: true
      },
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
      ],
      processed: [
        'deploy.processed.php'
      ]
    },
    preprocess: {
      options: {
        context: {
          'COMMIT_HASH': commitHash
        }
      },
      page: {
          src: 'deploy', dest: 'deploy.processed.php'
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
      ['less:style', 'concat:bootstrap', 'concat:pickadate', 'copy:setup']
    );
  });

  grunt.registerTask('build', 'preparar o projeto para deploy', function () {
    var done = this.async();

    // spawn processo que executa o comando que pega o hash
    grunt.util.spawn({

      cmd: 'git',
      // usando as short commit tags, conflito é pouco provável mais possível
      args: ['log', '-n 1', '--pretty=format:%h']

    }, function (err, result) {
      if (!err) {
        // mudamos a configuração do preprocess
        grunt.config("preprocess.options.context.COMMIT_HASH", String(result));
        runTasks();
      } else
          grunt.fail.warn(err);
    });

    function runTasks () {
      grunt.task.run([
        'clean:build',
        'setup',
        'requirejs:build',
        'uglify:requirejs',
        'less:compress',
        'preprocess:page',
        'copy:page',
        'copy:font',
        'clean:buildfiles'
      ]);
      // terminamos a task
      done();
    }
  });

  grunt.registerTask('deploy', 'copiar o build para o backend', function () {
    grunt.task.run([
      'build',
      'clean:deploy',
      'copy:deploy',
      'clean:build',
      'clean:processed'
    ]);
  });

};
