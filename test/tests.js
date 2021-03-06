require([

    "sinon",
    "chai",
    "sinon-chai",
    "categoriaModel",
    "atividadeModel",
    "comprovanteModel",
    "multiplicadorModel",
    "professorModel",
    "tipoModel",
    "atividadeCollection",
    "categoriaCollection",
    "comprovanteCollection",
    "multiplicadorCollection",
    "professorCollection",
    "tipoCollection",
    "cadastroView",
    "aplicacao"

], function (sinon, chai, sinonChai) {
    chai.use(sinonChai);
    window.should = chai.should();
    mocha.run();
});