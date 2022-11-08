sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
], function (Controller, MessageToast, Filter, FilterOperator, Dialog, Button, Text) {
    "use strict";
    let searchProperty = "SecondName"
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

        //search bar mechanics:
        onSearch: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter(searchProperty, FilterOperator.Contains, sQuery)];
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
        //select property for searching:
        byFN: function () {
            searchProperty = "FirstName";
        },
        bySN: function () {
            searchProperty = "SecondName";
        },
        byPhoneNum: function () {
            searchProperty = "PhoneNumber";
        },
        byEmail: function () {
            searchProperty = "email";
        },
        //#####################################################

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