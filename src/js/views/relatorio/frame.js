define([

    "text!../../templates/relatorio/frame.html",
    "collections/categoria"

    ], function(relatorioFrameTpl, categoriaCollection) {

        var RelatorioFrame = Backbone.View.extend({

            el: "#content",

            events: {
                "click #gerar": "gerarRelatorio"
            },

            initialize: function () {
                this.on("close", this.cleanUp, this);
            },

            render: function() {
                var data = categoriaCollection.toJSON();

                this.$el.html(_.template(relatorioFrameTpl, { categorias : data }));
                this.$(".datepicker").pickadate({
                    format: "dd de mmmm de yyyy",
                    formatSubmit: "dd/mm/yyyy"
                });
                return this;
            },

            gerarRelatorio: function () {
                var inicio, fim, classe, nivel, categorias;
            },

            cleanUp: function () {
                $(".datepicker").remove();
            }

        });

        return RelatorioFrame;

});