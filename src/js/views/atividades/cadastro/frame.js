define([

    "models/atividade",
    "models/comprovante",
    "collections/atividade",
    "collections/comprovante",
    "views/atividades/cadastro/categorias",
    "views/atividades/cadastro/tipos",
    "views/alerts/successAlert",
    "views/alerts/errorAlert",
    "text!templates/atividades/cadastro/frame.html"

    ], function(Atividade, Comprovante, atividadeCollection,
                comprovanteCollection, CategoriasView,
                TiposView,
                SuccessAlertView,
                ErrorAlertView,
                cadastroAtivFrameTpl) {

        var CadastroAtividadeFrame = Backbone.View.extend({

            el : "#content",

            tpl: cadastroAtivFrameTpl,

            subViews : {
                categorias : null,
                tipos      : null,
                alert: {
                    sucss      : new SuccessAlertView(),
                    err        : new ErrorAlertView()
                }
            },

            events: {
                "click #cadastrar": "criarAtividade"
            },

            initialize : function () {

                this.subViews.categorias = new CategoriasView();
                this.subViews.tipos      = new TiposView();

                this.on("close", this.cleanUp, this);

                this.listenTo(this.subViews.tipos, "close", this.catSemTipo, this);

                this.listenTo(this.subViews.tipos, "tipoSelected", this.catComTipo, this);

                this.listenTo(this.subViews.categorias, "change", this.renderTipos);

            },

            catSemTipo : function () {
                this.$("#dates-controls-block").hide();
            },

            catComTipo : function () {
                this.$("#dates-controls-block").show();
            },

            render : function () {

                this.$el.html(_.template(this.tpl, {
                    editar: false,
                    atual: this.options.atual
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

            renderTipos : function (idCategoria) {

                $("#tipos").empty();

                this.subViews.tipos
                    .setElement($("#tipos-block"))
                    .render(idCategoria);
            },

            resetDados: function () {
                _.each(_.omit(this.subViews, "alert"), function (subView) {
                    if (subView.resetDados) subView.resetDados();
                });
                this.$("#dataInicio").val("");
                this.$("#dataFim").val("");
            },

            preparaDados: function () {
                var dataInicio, dataFim, dataFormato, dataLang, dadosCadastro = {};

                dadosCadastro.err = [];

                _.each(_.omit(this.subViews, "alert"), function (subView) {
                    subView.preparaDados(dadosCadastro);
                });

                var dateParse = function (el) {
                    return el.pickadate().data("pickadate").getDate(true);
                };

                var dateFormat  = function (el) {
                    return el.pickadate().data("pickadate").getDate("dd/mm/yyyy");
                };

                dataInicio  = this.$("#dataInicio");
                dataFim     = this.$("#dataFim");

                console.log("datas: ", dateFormat(dataInicio), dateFormat(dataFim));

                if (!dataInicio.val()) {
                    dadosCadastro.err.push("Escolha a data em que a atividade iniciou");
                } else if (!dataFim.val()) {
                    dadosCadastro.err.push("Escolha a data em que a atividade terminou");
                } else if (dateParse(dataInicio) > dateParse(dataFim)) {
                    dadosCadastro.err.push("Escolha uma data de inicio anterior a data de fim");
                } else {
                    dadosCadastro.inicio = dateFormat(dataInicio);
                    dadosCadastro.fim    = dateFormat(dataFim);
                }

                return dadosCadastro;
            },

            criarAtividade: function () {
                var atividadeAttrHash, atividade = {}, cids = [], comprovantes;

                console.log("cadastroAtividadeFrame > cadastrando atividade");

                atividade = this.preparaDados();
                comprovantes = atividade.comprovantes;
                atividadeAttrHash = _.omit(atividade, "err", "comprovantes");
                var alert = _.bind(this.alert, this);

                var a = new Atividade(atividadeAttrHash);

                comprovantes = _.map(comprovantes, function (file) {
                    var c = new Comprovante({ nome: file.name, arquivo: file });
                    c.urlRoot = comprovanteCollection.url;
                    return c;
                });

                a.urlRoot = atividadeCollection.url;
                var atividadeValida;

                if (_.isEmpty(atividade.err)) {

                    atividadeValida = a.save();
                    if (atividadeValida) {
                        atividadeValida
                          .then(function (data) {

                            _.each(comprovantes, function (c) { c.set("atividade", data.id); });
                            return $.when.apply(this, _.map(comprovantes, function (c) { return c.save(); }));

                        }).then(function () {

                            comprovanteCollection.add(comprovantes);
                            atividadeCollection.add(a);
                            _.each(comprovantes, function (c) { a.addComprovante(c); });
                            alert("Atividade Cadastrada com sucesso", { type: "success" });

                        }, function (jqXHR, textStatus, errorThrown) {

                            a.destroy();
                            _.each(comprovantes, function (c) { c.destroy(); });
                            console.log("cadastroAtividadeFrame > erro:", arguments);
                            alert("Houve um erro ao tentar cadastrar a atividade. Certifique-se que todos os campos estão devidamente preenchidos", {type: "err"});

                        });
                    } else {
                        console.log("Erro na validação da atividade: ", a.validationError);
                    }
                }


/*
                var comprovanteCriado = _.bind(function (atividade) {
                    return _.bind(function (comprovante) {
                        atividade.addComprovante(comprovante);
                        if (atividade.get("comprovantes").length === _.keys(comprovantes).length)
                            this.alert("Atividade cadastrada com sucesso", { type: "success" });
                    }, this);
                }, this);

                var criarComprovantes = function (atividade) {
                    _.each(comprovantes, function (file) {
                        var c = { nome: file.name, arquivo: file, atividade: atividade.get("id") };
                        comprovanteCollection.create(c, { success: comprovanteCriado(atividade) });
                    });
                };
*/
                if (!_.isEmpty(atividade.err)) {
                    _.each(atividade.err, function (errMsg) {
                        this.alert(errMsg, { type: "err" });
                    }, this);
                }
            },

            alert: function (message, options) {
                var alertTypes = {
                    err:   this.subViews.alert.err,
                    success: this.subViews.alert.sucss
                };

                alertTypes[options.type].setElement("#err").render(message);
            },

            cleanUp: function() {
                $(".datepicker").remove();
                _.each(_.omit(this.subViews,"alert"), function (subView) {
                   subView.close();
                });
            }
        });

        return CadastroAtividadeFrame;

});
