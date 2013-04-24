define([

    "models/atividade",
    "models/comprovante",
    "collections/atividade",
    "collections/comprovante",
    "views/atividades/cadastro/multiplicador",
    "views/atividades/cadastro/descricao",
    "views/atividades/cadastro/tipos",
    "views/atividades/cadastro/frame",
    "util/dummyData"

    ],  function (Atividade, Comprovante, AtividadeCollection, ComprovanteCollection,
                  MultiplicadorView,
                  DescricaoView,
                  TiposView,
                  CadastroFrame,
                  dummyData) {

        describe("Cadastro Atividades View", function () {
            beforeEach(function (done) {
                dummyData.load();
                done();
            });
            afterEach(function (done) {
                dummyData.reset();
                done();
            });
            describe("Renderização", function () {
                beforeEach(function (done) {
                    $("<div>").attr("id", "content").css("display", "none").appendTo("body");
                    this.cadastroView = new CadastroFrame();
                    this.cadastroView.render();
                    done();
                });
                afterEach(function (done) {
                    this.cadastroView.remove();
                    $(".datepicker").remove();
                    done();
                });
                it("O select de categorias deve ser renderizado", function (done) {
                    this.cadastroView.subViews
                    .categorias.$el.find("#categoria-selector")
                    .should.have.length(1);
                    done();
                });
                it("O select de tipos deve ser renderizado", function (done) {
                    this.cadastroView.subViews
                    .tipos.$el.find("#tipo-selector")
                    .should.have.length(1);
                    done();
                });
                it("O textarea da descrição deve ser renderizado", function (done) {
                    this.cadastroView.subViews.tipos.subViews
                    .descricao.$el.find("#descricao")
                    .should.have.length(1);
                    done();
                });
                it("O input do valor do multiplicador deve ser renderizado", function (done) {
                    this.cadastroView.subViews.tipos.subViews
                    .multiplicador.$el.find("#quantidade")
                    .should.have.length(1);
                    done();
                });
                it("O input dos arquivos comprovantes deve ser renderizado", function (done) {
                    this.cadastroView.subViews.tipos.subViews
                    .comprovantes.$el.find("#comprovantes")
                    .should.have.length(1);
                    done();
                });
                it("O input para a data de inicio deve ser renderizado", function (done) {
                    this.cadastroView.$el.find("#dataInicio").should.have.length(1);
                    done();
                });
                it("O input para a data de fim deve ser renderizado", function (done) {
                    this.cadastroView.$el.find("#dataFim").should.have.length(1);
                    done();
                });
            });
            describe("Interação", function () {
                beforeEach(function (done) {
                    $("<div>").attr("id", "content").css("display", "none").appendTo("body");
                    this.renderTiposSpy = sinon.spy(TiposView.prototype, "render");
                    this.renderDescricaoSpy = sinon.spy(DescricaoView.prototype, "render");
                    this.renderMultiplicadorSpy = sinon.spy(MultiplicadorView.prototype, "render");
                    this.cadastroView = new CadastroFrame();
                    this.cadastroView.render();
                    done();
                });
                afterEach(function (done) {
                    TiposView.prototype.render.restore();
                    DescricaoView.prototype.render.restore();
                    MultiplicadorView.prototype.render.restore();
                    this.cadastroView.remove();
                    $(".datepicker").remove();
                    done();
                });
                it("A lista de tipos deve ser atualizada se a categoria mudar", function (done) {
                    this.cadastroView.subViews
                        .categorias.$el.find("#categoria-selector").change();
                    this.renderTiposSpy.should.have.been.calledTwice;
                    done();
                });
                it("A Descrição deve ser atualizada se o tipo mudar", function (done) {
                    this.cadastroView.subViews
                        .tipos.$el.find("#tipo-selector").change();
                    this.renderDescricaoSpy.should.have.been.calledTwice;
                    done();
                });
                it("O multiplicador deve ser atualizado se o tipo mudar", function (done) {
                    this.cadastroView.subViews
                        .tipos.$el.find("#tipo-selector").change();
                    this.renderMultiplicadorSpy.should.have.been.calledTwice;
                    done();
                });
            });
            describe("Comprovante SubView", function () {
                beforeEach(function (done) {
                    $("<div>").attr("id", "content").css("display", "none").appendTo("body");
                    this.cadastroView = new CadastroFrame();
                    this.cadastroView.render();
                    done();
                });
                afterEach(function (done) {
                    this.cadastroView.remove();
                    $(".datepicker").remove();
                    done();
                });
                describe("Inicialização", function () {
                    it("O hash de arquivos selecionados deve estar vazio", function (done) {
                        this.cadastroView.subViews.tipos.subViews.comprovantes
                            .selecionados.should.be.empty;
                        done();
                    });

                    // Como testar os arquivos???
                });
            });
            describe("Cadastro de atividade", function () {
                beforeEach(function (done) {
                    $("<div>").attr("id", "content").css("display", "none").appendTo("body");
                    this.cadastroView = new CadastroFrame();
                    this.cadastroView.render();
                    done();
                });
                afterEach(function (done) {
                    this.cadastroView.remove();
                    $(".datepicker").remove();
                    done();
                });

                describe('Validação', function () {
                    beforeEach(function (done) {
                        $("#quantidade").val(2);
                        $("#dataInicio").val("01/03/2013");
                        $("#dataFim").val("02/03/2013");
                        this.cadastroView.subViews.tipos.subViews
                            .comprovantes.selecionados["foo"] = "foo";
                        this.dadosCadastro = this.cadastroView.preparaDados();

                        AtividadeCollection.url    = "localhost/rad-ufu/api/atividade";
                        ComprovanteCollection.url  = "localhost/rad-ufu/api/coprovante";

                        this.comprovanteSaveSpy = sinon.spy(Comprovante.prototype, "save");
                        this.atividadeSaveSpy   = sinon.spy(Atividade.prototype, "save");
                        done();
                    });
                    afterEach(function (done) {
                        this.comprovanteSaveSpy.restore();
                        this.atividadeSaveSpy.restore();
                        done();
                    });
                    it("Não deve enviar nenhuma requisição se houver algum erro de validação", function (done) {
                        this.cadastroView.$el.find("#cadastrar").click();
                        this.comprovanteSaveSpy.should.not.have.been.called;
                        this.atividadeSaveSpy.should.not.have.been.called;
                        done();
                    });
                });

                describe("Descrição", function () {
                    beforeEach(function (done) {
                        $("#quantidade").val(2);
                        $("#dataInicio").val("01/03/2013");
                        $("#dataFim").val("02/03/2013");
                        this.cadastroView.subViews.tipos.subViews
                            .comprovantes.selecionados["foo"] = "foo";
                        this.dadosCadastro = this.cadastroView.preparaDados();
                        done();
                    });
                    it("Deve ocorrer um erro se o campo de descrição for vazio", function (done) {
                        this.dadosCadastro.err.should.have.length(1);
                        done();
                    });
                });
                describe("Quantidade", function () {
                    beforeEach(function (done) {
                        $("#descricao").val("desc");
                        $("#dataInicio").val("01/03/2013");
                        $("#dataFim").val("02/03/2013");
                        this.cadastroView.subViews.tipos.subViews
                            .comprovantes.selecionados["foo"] = "foo";
                        this.dadosCadastro = this.cadastroView.preparaDados();
                        done();
                    });
                    it("Deve ocorrer um erro se o campo de quantidade for vazio", function (done) {
                        this.dadosCadastro.err.should.have.length(1);
                        done();
                    });
                    it("Deve ocorrer um erro se o campo de quantidade não for numérico", function (done) {
                        $("#qunatidade").val("oi");
                        this.dadosCadastro.err.should.have.length(1);
                        done();
                    });
                });
                describe("Comprovantes", function () {
                    beforeEach(function (done) {
                        $("#quantidade").val(2);
                        $("#descricao").val("desc");
                        $("#dataInicio").val("01/03/2013");
                        $("#dataFim").val("02/03/2013");
                        this.dadosCadastro = this.cadastroView.preparaDados();
                        done();
                    });
                    it("Deve ocorrer um erro se não for anexado pelo menos um comprovante", function (done) {
                        this.dadosCadastro.err.should.have.length(1);
                        done();
                    });
                });
                describe("Datas", function () {
                    beforeEach(function (done) {
                        $("#quantidade").val(2);
                        $("#descricao").val("desc");
                        this.cadastroView.subViews.tipos.subViews
                            .comprovantes.selecionados["foo"] = "foo";
                        done();
                    });
                    it("Deve ocorrer um erro se a data de início não for informada", function (done) {
                        $("#dataFim").val("02/03/2013");
                        this.dadosCadastro.err.should.have.length(1);
                        done();
                    });
                    it("Deve ocorrer um erro se a data de fim não for informada", function (done) {
                        $("#dataInicio").val("01/03/2013");
                        this.dadosCadastro.err.should.have.length(1);
                        done();
                    });
                    it("Deve ocorrer um erro se a data de início for posterior a data de fim", function (done) {
                        $("#dataInicio").val("02/03/2013");
                        $("#dataFim").val("01/03/2013");
                        this.dadosCadastro.err.should.have.length(1);
                        done();
                    });
                });
                describe("Cadastro", function () {
                    beforeEach(function (done) {
                        $("#quantidade").val(2);
                        $("#descricao").val("desc");
                        $("#dataInicio").val("01/03/2013");
                        $("#dataFim").val("02/03/2013");

                        this.cadastroView.subViews.tipos.subViews
                            .comprovantes.selecionados["foo"] = {name:"foo"};
                        this.cadastroView.subViews.tipos.subViews
                            .comprovantes.selecionados["bar"] = {name:"bar"};

                        AtividadeCollection.url    = "localhost/rad-ufu/api/atividade";
                        ComprovanteCollection.url  = "localhost/rad-ufu/api/coprovante";
                        this.comprovanteSaveSpy = sinon.spy(Comprovante.prototype, "save");
                        this.atividadeSaveStub   = sinon.stub(Atividade.prototype, "save")
                            .returns(new $.Deferred().resolve({id: 1}));

                        this.cadastroRedirectStub = sinon.stub(CadastroFrame.prototype, "redirect");

                        this.atividadeParseStub    = sinon.stub(Atividade.prototype, "parse")
                            .returns({
                                "id":1,
                                "valorMult":2,
                                "descricao":"desc",
                                "inicio":"01/03/2013",
                                "fim":"02/03/2013",
                                "tipo":1,
                                "comprovantes":[1]
                            });

                        this.ajaxStub = sinon.stub($, "ajax").yieldsTo("success");

                        done();
                    });
                    afterEach(function (done) {
                        this.comprovanteSaveSpy.restore();
                        this.atividadeSaveStub.restore();
                        this.atividadeParseStub.restore();
                        this.ajaxStub.restore();
                        this.cadastroRedirectStub.restore();
                        done();
                    });
                    it("Deve ser cadastrada uma nova atividade quando houver um click no botão 'cadastrar'", function (done) {
                        this.cadastroView.$el.find("#cadastrar").click();
                        this.comprovanteSaveSpy.should.have.been.calledTwice;
                        this.atividadeSaveStub.should.have.been.calledOnce;
                        this.cadastroRedirectStub.should.have.been.calledOnce;
                        done();
                    });
                });
            });
        });
    });