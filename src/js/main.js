require.config({

    // Development: previne contra o cache dos browsers
    urlArgs : new Date().getTime(),

    baseUrl: "src/js",

    paths : {
        "jquery"       : "../../components/jquery/jquery",
        "underscore"   : "../../components/underscore/underscore",
        "backbone"     : "../../node_modules/backbone/backbone",
        "text"         : "../../node_modules/text/text",
        "bootstrap"    : "../../components/bootstrap/bootstrap",

        // Development: armazenagem temporária dos dados
        "backbone.localStorage" : "../../components/backbone/backbone.localStorage",
        "dummyData": "util/dummyData"
    },

    shim : {
        "app" : {
            deps : [
                "backbone",
                "backbone.localStorage",
                "underscore",
                "jquery",
                "bootstrap",
                "dummyData"
            ]
        },

        "dummyData": {
            deps: [
                "backbone.localStorage"
            ]
        },

        "bootstrap" : {
            deps : ["jquery"]
        },

        "backbone.localStorage" : {
            deps    : ["backbone"],
            exports : "Backbone"
        },

        "underscore" : {
            exports : "_"
        },

        "backbone" : {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps : ["underscore", "jquery"],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports : "Backbone"
        }
    }
});

require([

    "dummyData",
    "app"

    ], function(dummy, App) {

        App.init();

});