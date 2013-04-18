define([

    "views/atividades/cadastro/frame",
    "views/atividades/edicao/categorias",
    "views/atividades/edicao/tipos",
    "collections/comprovante",
    "collections/tipo"

    ],  function (CadastroAtividadeFrame, CategoriasView, TiposView,
                  comprovanteCollection,
                  tipoCollection) {

        var EdicaoAtividadeFrame = CadastroAtividadeFrame.extend({

            events: {
                "click #salvar": "editarAtividade"
            },

            initialize : function () {

                var idCategoria = tipoCollection.get(this.model.get("tipo"))
                    .get("categoria");

                this.subViews.categorias = new CategoriasView({atual:idCategoria});
                this.subViews.tipos      = new TiposView({
                    atual:this.model.get("tipo"),
                    model:this.model
                });

                this.on("close", this.cleanUp, this);

                this.listenTo(this.subViews.tipos, "close", this.catSemTipo, this);

                this.listenTo(this.subViews.tipos, "tipoSelected", this.catComTipo, this);

                this.listenTo(this.subViews.categorias, "change", this.renderTipos);

                //console.log(this.model);
            },

            render : function () {
                var atual = this.model.toJSON();

                this.$el.html(_.template(this.tpl, {
                    editar: true,
                    atual: atual
                }));


                this.subViews.categorias
                    .setElement($("#categorias-block"))
                    .render();

                this.subViews.categorias
                    .categoriaSelected();

                // inicializa os tooltips
                this.$("[rel=\"tooltip\"]").tooltip();

                // inicializa datepickers
                this.$(".datepicker").pickadate({
                    format: "dd de mmmm de yyyy",
                    formatSubmit: "dd/mm/yyyy"
                });

                return this;

            },

            editarAtividade: function () {
                console.log("editando atividade");
                var atividade, addToAtividade, rmFromAtividade;

                addToAtividade  = _.bind(this.model.addComprovante, this.model);
                rmFromAtividade = _.bind(this.model.rmComprovante, this.model);

                atividade = this.preparaDados();

                var alert = _.bind(this.alert, this);
                var atividadeAttrHash     = _.omit(atividade, "toDestroy" ,"atuais", "err", "selecionados", "categoria");
                var comprovantesToRm = atividade.toDestroy;

                var Comprovante       = comprovanteCollection.model;
                var comprovantesToAdd = _.map(atividade.selecionados, function (file) {
                    var c = new Comprovante({ nome: file.name, arquivo: file, atividade: this.model.get("id")});
                    c.urlRoot = comprovanteCollection.url;
                    return c;
                }, this);

                if (!_.isEmpty(atividade.err)) {

                    _.each(atividade.err, function (errMsg) {
                        this.alert(errMsg, { type: "err" });
                    }, this);

                } else {

                    var atividadeValida = this.model.save(atividadeAttrHash, { wait: true });

                    if (atividadeValida) {

                        atividadeValida.then(function () {

                            return $.when.apply(this, _.map(comprovantesToAdd, function (c) { return c.save(); }));

                        }).then(function () {

                            comprovanteCollection.add(comprovantesToAdd);
                            _.each(comprovantesToAdd, function (c) { addToAtividade(c); });
                            alert("Dados da atividade alterados", { type: "success" });

                        }, function (jqXHR, textStatus, errorThrown) {
                            _.each(comprovantesToAdd, function (c) { c.destroy(); });
                        });

                        _.each(comprovantesToRm, function (c) {
                            c.destroy({ success: rmFromAtividade });
                        });

                    } else {
                        console.log("Erro de validação na atividade: ", this.model.validationError);
                    }


                    /*
                    // se existem arquivos comprovantes para excluir da atividade
                    if (!_.isEmpty(atividade.toDestroy)) {
                        _.each(atividade.toDestroy, function (c) {
                            c.destroy({ success: rmFromAtividade });
                        });
                    }

                    // Se existem novos arquivos para a atividade temos que
                    // grava-los
                    if (!_.isEmpty(atividade.selecionados)) {
                        _.each(atividade.selecionados, function (f) {
                            comprovanteCollection.create({
                                nome:f.name,
                                arquivo:f,
                                atividade: this.model.get("id")
                            }, { success: addToAtividade });
                        }, this);
                    }
                    atividade = _.omit(atividade, "toDestroy" ,"atuais", "err", "selecionados", "categoria");
                    this.model.save(atividade);
                    */

                }
                console.log(atividade);
            }
        });

        return EdicaoAtividadeFrame;
});