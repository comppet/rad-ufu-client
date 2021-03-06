//
// Módulo para renderização de alerts do bootstrap as options é um map {type, msg}
// o 'type' é um tipo de alert do bootstrap e 'msg' é a mensagem a ser exibida
//
define([

    "text!templates/alert.html"

    ], function (alertTpl) {

        var AlertView = Backbone.View.extend({

            tpl: alertTpl,

            el : "#err",

            data: {
                type: "elert-info",
                icon: "icon-info-sign"
            },

            cleanUp : function () {},

            render : function (msg) {
                this.data.msg = msg;

                this.cleanUp();
                this.$el.append(_.template(alertTpl, this.data));
            }
        });

    return AlertView;

});