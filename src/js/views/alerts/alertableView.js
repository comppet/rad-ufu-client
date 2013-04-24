define([

    "views/alerts/errorAlert",
    "views/alerts/successAlert"

    ],  function (ErrorAlertView, SuccessAlertView) {

        var AlertableView = Backbone.View.extend({
            subViews: {
                alert: {
                    err:   new ErrorAlertView(),
                    sucss: new SuccessAlertView()
                }
            },

            alert: function (message, options) {
                var alertTypes = {
                    err:     this.subViews.alert.err,
                    success: this.subViews.alert.sucss
                };

                alertTypes[options.type].setElement("#err").render(message);
            }
        });

    return AlertableView;
});