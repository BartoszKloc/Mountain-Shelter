sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("bksoft.frontend.controller.MainView", {
            onInit: function () {

            },
            toggleThemeChange: function () {
                if (this.getView().byId("themeSwitch").getState()) {
                  sap.ui.getCore().applyTheme("sap_fiori_3_dark");
                } else {
                  sap.ui.getCore().applyTheme("sap_fiori_3");
                }
              },
        });
    });
