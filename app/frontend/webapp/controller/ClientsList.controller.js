sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, JSONModel, History) {
    "use strict";
    return Controller.extend("bksoft.frontend.controller.ClientsList", {
        onInit: function () {
            var dataValue;
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

            const View = this.getView();

            async function test2(View) {
                const res = await $.ajax({
                    method: "GET",
                    url: "/catalog/Clients",
                    dataType: "JSON"
                }).done((data) => {
                    console.log(data.value)
                    return data.value;
                })
                var oModelClients = new JSONModel;
                oModelClients.setData(res);
                View.setModel(oModelClients, 'clientsList');
            }
            test2(View);

        },
        onSubmit: function () {
            var sClientFirstName = this.getView().getModel().getProperty("/client/firstName");
            var sClientSecondName = this.getView().getModel().getProperty("/client/secondName");
            var sClientPhoneNum = this.getView().getModel().getProperty("/client/phoneNum");
            var sClientEmail = this.getView().getModel().getProperty("/client/email");
            // show message

            if (sClientFirstName != "") {
                MessageToast.show("client added");
                console.log(sClientFirstName);
                console.log(sClientSecondName);
                console.log(sClientPhoneNum);
                console.log(sClientEmail);
            }
            else MessageToast.show("Empty field!");
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