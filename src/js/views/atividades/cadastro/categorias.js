define([

    "collections/categoria",
    "text!templates/atividades/cadastro/categorias.html"

    ],  function(catCollection, categoriasTpl) {

        var CategoriasView = Backbone.View.extend({

            collection: catCollection,

            tpl: categoriasTpl,

            events : {
                "change #categoria-selector" : "categoriaSelected"
            },

            categoriaSelected : function () {
                this.trigger("change", $("#categoria-selector").val());
            },

            render : function () {
                var data = {};
                data.categorias  = this.collection.toJSON();
                data.atual       = this.options.atual;

                this.$el.html(_.template(this.tpl, data));

                return this;
            },

            preparaDados: function (dadosCadastro) {
                var c = this.$("#categoria-selector").val();
                // validar e (caso exista algum erro não modificar dadosCadastro)
                dadosCadastro.categoria = +c;
            }
        });

        return CategoriasView;
});