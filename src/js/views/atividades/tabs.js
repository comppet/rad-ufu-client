define([

    "util/evAggregator",
    "text!templates/atividades/tabs.html",
    "collections/categoria"

    ], function(evAggregator, tabsCategoriaTpl, CategoriaCollection) {

        var CategoriaTabsView = Backbone.View.extend({

            collection : CategoriaCollection,

            render : function(categoria) {

                this.$el.html(_.template(tabsCategoriaTpl, {
                    categorias  : this.collection,
                    selecionada : categoria
                }));

                return this;

            }
        });

        return CategoriaTabsView;

});