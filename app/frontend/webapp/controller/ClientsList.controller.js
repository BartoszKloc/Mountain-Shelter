sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("bksoft.frontend.controller.ClientsList", {
        onInit: function () {
            // set data model on view
            var oDataInput = {
                client: {
                    firstName: "",
                    secondName: "",
                    phoneNum: "",
                    email: ""
                }
            };
            var oModel = new JSONModel(oDataInput);
            this.getView().setModel(oModel);
        },
        onShowHello: function () {
            var sClientFirstName = this.getView().getModel().getProperty("/client/firstName");
            var sClientSecondName = this.getView().getModel().getProperty("/client/secondName");
            var sClientPhoneNum = this.getView().getModel().getProperty("/client/phoneNum");
            var sClientEmail = this.getView().getModel().getProperty("/client/email");
            // show message
            MessageToast.show("client added");
            // console.log(sClientFirstName);
            // console.log(sClientSecondName);
            // console.log(sClientPhoneNum);
            // console.log(sClientEmail);
        }
    });
});