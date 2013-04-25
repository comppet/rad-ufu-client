define([

    "text!../../templates/relatorio/frame.html",
    "models/relatorio",
    "collections/categoria",
    "util/dateHelper",
    "views/alerts/alertableView"

    ], function(relatorioFrameTpl, Relatorio, categoriaCollection, dateHelper,
                AlertableView) {

        var RelatorioFrame = AlertableView.extend({

            el: "#content",

            model: new Relatorio(),

            events: {
                "click #gerar": "gerarRelatorio"
            },

            initialize: function () {
                this.on("close", this.cleanUp, this);
                this.listenTo(this.model, "sync", this.relatorioPronto, this);
            },

            render: function() {
                var data = {};

                data.categorias = categoriaCollection.toJSON();

                this.$el.html(_.template(relatorioFrameTpl, data));
                this.$(".datepicker").pickadate({
                    format: "dd de mmmm de yyyy",
                    formatSubmit: "dd/mm/yyyy"
                });
                return this;
            },

            gerarRelatorio: function () {

                var relatorio, attrs, dataInicioEl, dataFimEl, checkedCBox;

                checkedCBox = "input:checkbox[name=categoria]:checked";

                attrs = {};

                dataInicioEl = this.$("#dataInicio");
                dataFimEl    = this.$("#dataFim");

                attrs.inicio = dataInicioEl.val() ?
                    dateHelper.parse(dataInicioEl) : "";

                attrs.fim = dataFimEl.val() ?
                    dateHelper.parse(dataFimEl) : "";

                attrs.classe = +this.$("#classe").val();
                attrs.nivel  = +this.$("#nivel").val();

                attrs.categorias = _.map(this.$(checkedCBox), function (c) {
                    return +$(c).val();
                });


                this.model.set(attrs);

                var jqXHR, alert;

                alert = _.bind(this.alert, this);
                if ((jqXHR = this.model.save()))
                    jqXHR
                        .then(function (data) {
                            console.log("Relatório gerado: ", data);
                        }, function (jqXHR, textStatus, errorThrown) {
                            //console.log(arguments);
                            alert("Houve um erro ao tentar gerar o relatório. Certifique-se que todos os campos estão devidamente preenchidos", {type: "err"});
                        });
                else
                    alert(this.model.validationError, { type: "err" });

            },

            relatorioPronto: function () {
                var dloadPrefix = "api/arquivo/relatorio/";
                this.$("#dloadRelatorio").attr("href", dloadPrefix + this.model.get("dloadLink"));
                this.$("#dloadRelatorio")[0].click();
            },

            cleanUp: function () {
                $(".datepicker").remove();
            }

        });

        return RelatorioFrame;

});