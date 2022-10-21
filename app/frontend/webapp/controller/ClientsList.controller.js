sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, JSONModel, History, Filter, FilterOperator) {
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

            if ((sClientFirstName != "") && (sClientSecondName != "") && (sClientPhoneNum != "") && (sClientEmail != "")) {
                MessageToast.show("client added");
                let oClientData = {
                    FirstName: sClientFirstName,
                    SecondName: sClientSecondName,
                    PhoneNumber: sClientPhoneNum,
                    email: sClientEmail
                }

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(oClientData),
                    url: "/catalog/Clients",
                    contentType: "application/json"
                });
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
        },
        // deleteClient: function (oEvent) {
        // },
        // onSearch: function (oEvent) {
        //     // build filter array
        //     var aFilter = [];
        //     var sQuery = oEvent.getParameter("query");
        //     if (sQuery) {
        //         aFilter.push(new Filter("email", FilterOperator.Contains, sQuery));
        //     }

        //     // filter binding
        //     var oList = this.byId("ClientsTable");
        //     var oBinding = oList.getBinding("email");
        //     oBinding.filter(aFilter);
        // }
    });
});