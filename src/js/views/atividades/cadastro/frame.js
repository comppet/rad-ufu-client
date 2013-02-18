define([

    "models/atividade",
    "models/comprovante",
    "collections/comprovante",
    "views/atividades/cadastro/categorias",
    "views/atividades/cadastro/tipos",
    "views/alert",
    "text!templates/atividades/cadastro/frame.html"

    ], function(Atividade, Comprovante, comprovanteCollection, CategoriasView,
                TiposView,
                AlertView,
                cadastroAtivFrameTpl) {

        var CadastroAtividadeFrame = Backbone.View.extend({

            el : $("#content"),

            tpl: cadastroAtivFrameTpl,

            subViews : {
                categorias : null,
                tipos      : null,
                err        : new AlertView()
            },

            events: {
                "click #cadastrar": "criarAtividade"
            },

            initialize : function () {

                this.subViews.categorias = new CategoriasView();
                this.subViews.tipos      = new TiposView();

                this.on("close", this.limpaSubviews, this);

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

                return this;

            },

            renderTipos : function (idCategoria) {

                $("#tipos").empty();

                this.subViews.tipos
                    .setElement($("#tipos-block"))
                    .render(idCategoria);
            },

            criarAtividade: function () {
                console.log("cadastrando atividade");
                var atividade, dados, fileInput, comprovantes;

                dados = {};

                dados.categoria    = this.$("#categoria-selector").val();
                dados.tipo         = this.$("#tipo-selector").val();
                dados.descricao    = this.$("#descricao").val();
                dados.valorMult    = this.$("#quantidade").val();
                dados.inicio       = this.$("#dataInicio").val();
                dados.fim          = this.$("#dataFim").val();
                fileInput          = this.$("#comprovantes")[0];
                comprovantes       = [];

                //console.log(fileInput);

                //
                // Cria um objeto 'Comprovante' para cada arquivo selecionado
                //
                comprovantes = _.map(fileInput.files, function (file) {
                    var c = new Comprovante({arquivo:file});
                    c.readFile();
                    return c;
                });

                atividade = new Atividade(dados);
                console.log(atividade, comprovantes);
                alert("todo");
            },

            limpaSubviews : function() {
                _.each(this.subViews, function (subView) {
                   subView.close();
                });
            }
        });

        return CadastroAtividadeFrame;

});
