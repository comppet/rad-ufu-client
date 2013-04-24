require.config({

    // Development: previne contra o cache dos browsers
    urlArgs : new Date().getTime(),

    baseUrl: "src/js",

    paths : {
        "jquery":       "../../components/jquery/jquery",
        "underscore":   "../../node_modules/underscore/underscore",
        "backbone":     "../../node_modules/backbone/backbone",
        "text":         "../../node_modules/text/text",
        "bootstrap":    "../../node_modules/bootstrap/bootstrap",
        "pickadate":     "../../node_modules/pickadate/pickadate",
        "datejs":        "../../node_modules/datejs/lib/date-pt-BR",
        "dummyData":    "util/dummyData"
    },

    shim : {
        "app" : {
            deps : [
                "backbone",
                "bootstrap",
                "pickadate",
                "datejs"
            ]
        },
        "router": {
            deps: ["backbone"]
        },
        "bootstrap" : {
            deps : ["jquery"]
        },
        "backbone" : {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps : ["underscore", "jquery"],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports : "Backbone"
        },
        "underscore" : {
            exports : "_"
        },
        "pickadate": {
            deps: ["jquery"]
        },
        "dummyData": {
            deps: ["backbone"]
        }
    }
});

require(["dummyData","app","router"], function(dummyData, App, Router) {
    dummyData.load();
    new App();
    new Router();
});