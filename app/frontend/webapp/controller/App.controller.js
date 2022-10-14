sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("bksoft.frontend.controller.App", {
        onInit() {
        },
        toggleThemeChange: function () {
          if (this.getView().byId("themeSwitch").getState()) {
            sap.ui.getCore().applyTheme("sap_fiori_3_dark");
          } else {
            sap.ui.getCore().applyTheme("sap_fiori_3");
          }
      },
      });
    }
  );
  