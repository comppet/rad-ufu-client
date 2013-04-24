define(function () {

        var Relatorio = Backbone.Model.extend({

            urlRoot: "api/relatorio",

            defaults: {
                inicio:     null,
                fim:        null,
                classe:     -1,
                nivel:      -1,
                categorias: [],
                dloadLink:  ""
            },

            validate: function (attrs) {
                if (!attrs.inicio || !attrs.fim)
                    return "Escolha a data de inicio e data de fim para o relatório";

                if (attrs.inicio > attrs.fim)
                    return "Escolha uma data de inicio anterior a data de fim";

                if (isNaN(attrs.classe) || attrs.classe === -1)
                    return "Escolha a classe em que se encontra";

                if (isNaN(attrs.nivel) || attrs.nivel === -1)
                    return "Escolha o nível";

                if (attrs.categorias.length === 0)
                    return "Escolha pelo menos uma categoria de atividades";
            },

            toJSON: function (options) {
                var formato = "dd/MM/yyyy", json = _.clone(this.attributes);

                json.inicio = this.get("inicio").toString(formato);
                json.fim    = this.get("fim").toString(formato);

                return json;
            }

        });

        return Relatorio;
});