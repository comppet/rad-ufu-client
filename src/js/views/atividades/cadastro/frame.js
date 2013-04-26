define([

    "models/atividade",
    "models/comprovante",
    "collections/atividade",
    "collections/comprovante",
    "views/atividades/cadastro/categorias",
    "views/atividades/cadastro/tipos",
    "util/dateHelper",
    "views/alerts/alertableView",
    "text!templates/atividades/cadastro/frame.html"

    ], function(Atividade, Comprovante, atividadeCollection,
                comprovanteCollection, CategoriasView,
                TiposView,
                dateHelper,
                AlertableView,
                cadastroAtivFrameTpl) {

        var CadastroAtividadeFrame = AlertableView.extend({

            el : "#content",

            tpl: cadastroAtivFrameTpl,

            subViews : _.extend({
                categorias : null,
                tipos      : null
            }, AlertableView.prototype.subViews),

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

                dataInicio  = this.$("#dataInicio");
                dataFim     = this.$("#dataFim");

                console.log("datas: ", dateHelper.format(dataInicio), dateHelper.format(dataFim));

                if (!dataInicio.val()) {
                    dadosCadastro.err.push("Escolha a data em que a atividade iniciou");
                } else if (!dataFim.val()) {
                    dadosCadastro.err.push("Escolha a data em que a atividade terminou");
                } else if (dateHelper.parse(dataInicio) > dateHelper.parse(dataFim)) {
                    dadosCadastro.err.push("Escolha uma data de inicio anterior a data de fim");
                } else {
                    dadosCadastro.inicio = dateHelper.format(dataInicio);
                    dadosCadastro.fim    = dateHelper.format(dataFim);
                }

                return dadosCadastro;
            },

            criarAtividade: function () {
                var atividadeAttrHash, atividade = {}, cids = [], comprovantes;

                console.log("cadastroAtividadeFrame > cadastrando atividade");

                atividade = this.preparaDados();
                comprovantes = atividade.comprovantes;
                atividadeAttrHash = _.omit(atividade, "err", "comprovantes");

                var alert    = _.bind(this.alert, this);
                var redirect = _.bind(this.redirect, this);

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

                            redirect("/rad-ufu/#/atividades/" +
                                $("#categoria-selector option:selected").text().trim().toLowerCase());

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

                if (!_.isEmpty(atividade.err)) {
                    _.each(atividade.err, function (errMsg) {
                        this.alert(errMsg, { type: "err" });
                    }, this);
                }
            },

            redirect: function (location) {
                window.location.href = location;
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
