define([

    "collections/categoria",
    "collections/atividade",
    "views/manager"

    ], function(categoriaCollection, atividadeCollection, ViewManager) {

        var AppRouter = Backbone.Router.extend({

            viewManager : new ViewManager(),

            routes : {

                "atividades/:id/editar"           : "editarAtividade",
                "atividades/cadastrar"            : "cadastrarAtividade",
                "atividades/:categoria"           : "listarAtividades",
                "atividades"                      : "primeiraCategoria",
                "relatorio"                       : "relatorio",
                "ajuda"                           : "ajuda",
                "inicio"                          : "paginaInicial",
                "*actions"                        : "defaultAction"
            },

            initialize : function() {

                this.viewManager.show("navbar", {once:true});

                this.on("route:editarAtividade", function (id) {
                    this.viewManager.show("atividades:edicao", {
                        model: atividadeCollection.get(id)
                    });
                });

                this.on("route:listarAtividades", function (c) {
                    c = decodeURIComponent(c);
                    this.viewManager.show("atividades", {categoria:c});
                });

                this.on("route:cadastrarAtividade", function () {
                    this.viewManager.show("atividades:cadastro");
                });


                // Redireciona para a route de atividades da primeira categoria na
                // collection de categorias
                this.on("route:primeiraCategoria", function () {
                    var cat, categorias = categoriaCollection;
                    //categorias.fetch();
                    cat = categorias.at(0).get("nome").toLowerCase();

                    this.navigate("#/atividades/" + cat, {trigger:true, replace:true});
                });

                this.on("route:relatorio", function () {
                    this.viewManager.show("relatorio");
                });

                this.on("route:ajuda", function(){
                    this.viewManager.show("ajuda");
                });

                this.on("route:paginaInicial", function(){
                    //this.viewManager.show("inicio");
                    this.navigate("#/atividades");
                });

                this.on("route:defaultAction", function(actions){
                    if (!actions) this.navigate("#/atividades");
                        console.log('No route:', actions);
                });

                Backbone.history.start();
            }

        });

        return AppRouter;

});