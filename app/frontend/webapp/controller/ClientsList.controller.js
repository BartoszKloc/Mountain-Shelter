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
        onSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any main list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("SecondName", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }

        },
        onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },
        _applySearch: function (aTableSearchState) {
            var oTable = this.byId("ClientsTable");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
        },
        navHome: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMainView");
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
                class: "sapUiMediumMargin",
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
    });
});