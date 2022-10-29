sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
], function (Controller, MessageToast, JSONModel, History, Filter, FilterOperator, Dialog, Button, Text) {
    "use strict";
    return Controller.extend("bksoft.frontend.controller.ClientsList", {
        onInit: function () {
        },
        onSubmit: function () {
            var sClientFirstName = this.byId("firstname").getValue();
            var sClientSecondName = this.byId("secondname").getValue();
            var sClientPhoneNum = this.byId("phone").getValue();
            var sClientEmail = this.byId("email").getValue();

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
        deleteClient: function (oEvent) {
            var oClient = oEvent.getSource().getBindingContext().getObject();
            var oID = oClient.ID;
            var oFirstName = oClient.FirstName;
            var oSecondName = oClient.SecondName;
            var dialogText = "Do you really want to delete user " + oFirstName + " " + oSecondName + "?";

            //create dialog:
            this.oResizableDialog = new Dialog({
                title: "{i18n>confirmAction}",
                resizable: false,
                content:
                    new Text({
                        text: dialogText,
                        class: "sapUiMediumMargin"
                    }),
                buttons: [
                    new Button({
                        text: "{i18n>yes}",
                        //function for deleting user:
                        press: async function () {
                            const URLstring = `/catalog/delete(msg='` + oID + `')`
                            var resHeaders = await fetch(URLstring);
                            resHeaders;
                            MessageToast.show("client has been deleted");
                            this.oResizableDialog.close();
                        }.bind(this)
                    }), new Button({
                        text: "{i18n>no}",
                        press: function () {
                            this.oResizableDialog.close();
                        }.bind(this)
                    })]
            });

            //to get access to the controller's model
            this.getView().addDependent(this.oResizableDialog);

            this.oResizableDialog.open();
        },
        handleOpen: function () {
            var oDialog = this.getView().byId("inputDialog");
            oDialog.open();
        },
        onClose: function () {
            var oDialog = this.getView().byId("inputDialog");
            oDialog.close();
        },
        onSearch: function (oEvent) {

            // build filter array
            var aFilter = [];
            var sQuery = oEvent.getParameter("query");
            if (sQuery) {
                aFilter.push(new Filter("email", FilterOperator.Contains, sQuery));
            }

            // filter binding
            var oList = this.byId("ClientsTable");
            var oBinding = oList.getBinding("email");
            oBinding.filter(aFilter);
        },
        onBeforeRendering: async function () {
            var noDataText = await this.getView().getModel("i18n").getResourceBundle().getText("noDataShow")
            await this.byId("ClientsTable").setNoDataText(noDataText)
        },
    });
});