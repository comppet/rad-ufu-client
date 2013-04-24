//
// Singleton para manipular as datas do pickadate.js
//
define(function () {

    var DateHelper = Backbone.Model.extend({
        parse: function (el) {
            return el.pickadate().data("pickadate").getDate(true);
        },
        format: function (el) {
            return el.pickadate().data("pickadate").getDate("dd/mm/yyyy");
        }
    });

    return new DateHelper();
});