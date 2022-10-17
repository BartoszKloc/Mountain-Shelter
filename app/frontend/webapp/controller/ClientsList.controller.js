sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/ui/core/routing/History'],
    function (Controller, coreLibrary, History) {
        "use strict";

        return Controller.extend("bksoft.frontend.controller.ClientsList", {
            onInit: function () {
            },
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("MainView", {}, true);
                }
            }
        });

    });
