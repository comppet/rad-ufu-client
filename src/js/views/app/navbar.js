define([

    "text!../../templates/app/navbar.html"

    ], function(appTpl) {

        var NavbarView = Backbone.View.extend({

            el : $("#navbar"),

            render : function() {
                this.$el.html(_.template(appTpl));

                return this;

            }

        });

        return NavbarView;

});