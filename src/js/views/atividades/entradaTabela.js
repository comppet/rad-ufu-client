define([

    "models/atividade",
    "collections/atividade",
    "collections/tipo",
    "collections/multiplicador",
    "text!templates/atividades/entradaTabela.html"

    ],  function(AtividadeModel, atividadeCollection, tipoCollection,
                 multiplicadorCollection,
                 atividadeTpl) {

        var AtividadeEntradaTabelaView = Backbone.View.extend({

            tagName : "tr",

            events: {
                "click li i.icon-remove": "removeAtividade",
                "click": "editarAtividade"
            },

            removeAtividade: function (ev) {
                var id = this.$(ev.target).data("id-atividade");
                console.log("removendo atividade com id:", id);
                atividadeCollection.remove(id);
            },

            editarAtividade: function () {
                var id = this.$el.data("id-atividade");
                window.location.href = "/#/atividades/" + id + "/editar";
            },

            render : function() {
                var valor = tipoCollection.get(this.model.tipo)
                        .get("pontuacao");

                this.model.pontuacao = this.model.valorMult * valor;

                this.$el.data("id-atividade", this.model.id);
                this.$el.html(_.template(atividadeTpl, this.model));

                // inicializa os tooltips
                this.$("[rel=\"tooltip\"]").tooltip();

                return this;
            }
        });

        return AtividadeEntradaTabelaView;
});