require.config({

    urlArgs: new Date().getTime(),

    paths: {
        "jquery": "../components/jquery/jquery",
        "underscore": "../node_modules/underscore/underscore",
        "backbone": "../node_modules/backbone/backbone",
        "localStorage": "../node_modules/Backbone.localStorage/backbone.localStorage",
        "bootstrap": "../node_modules/bootstrap/bootstrap",
        "pickadate": "../node_modules/pickadate/pickadate",
        "datejs":        "../../node_modules/datejs/lib/date-pt-BR",
        "text": "../node_modules/text/text",
        "chai": "../node_modules/chai/chai",
        "sinon": "../node_modules/sinon/pkg/sinon",
        "sinon-chai": "../node_modules/sinon-chai/lib/sinon-chai",
        "mocha": "../node_modules/mocha/mocha",
        "models": "../src/js/models",
        "views": "../src/js/views",
        "collections": "../src/js/collections",
        "templates": "../src/js/templates",
        "util": "../src/js/util"
    },

    shim: {
        "tests": {
            deps: [
                "localStorage",
                "mocha",
                "bootstrap",
                "pickadate",
                "datejs"
            ]
        },
        "mocha": {
            init: function () {
                this.mocha.setup("bdd");
                return this.mocha;
            }
        },
        "bootstrap" : {
            deps : ["jquery"]
        },
        "backbone": {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps : ["underscore", "jquery"],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports : "Backbone"
        },
        "localStorage": {
            deps: ["backbone"],
            exports: "Backbone"
        },
        "underscore": {
            exports : "_"
        },
        "pickadate": {
            deps: ["jquery"]
        }
    }
});

require(["tests"]);