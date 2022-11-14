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

    //object for properties that will be send in post request in edit client dialog:
    let editingClientData = {
        clientID: " ",
        clientFN: " ",
        clientSN: " ",
        clientPhoneNum: " ",
        clientEmail: " "
    };

    return Controller.extend("bksoft.frontend.controller.ClientsList", {
        onInit: function () {
        },
        onSubmit: function () {
            var sClientFirstName = this.byId("firstname");
            var sClientSecondName = this.byId("secondname");
            var sClientPhoneNum = this.byId("phone");
            var sClientEmail = this.byId("email");
            var oDialog = this.getView().byId("inputDialog");

            //post request while adding new client
            if ((sClientFirstName != "") && (sClientSecondName != "") && (sClientPhoneNum != "") && (sClientEmail != "")) {
                let oClientData = {
                    FirstName: sClientFirstName.getValue(),
                    SecondName: sClientSecondName.getValue(),
                    PhoneNumber: sClientPhoneNum.getValue(),
                    email: sClientEmail.getValue()
                }

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(oClientData),
                    url: "/catalog/Clients",
                    contentType: "application/json",
                    success: function (data) {
                        MessageToast.show("client added");
                        oDialog.close();
                        sClientFirstName.setValue("");
                        sClientSecondName.setValue("");
                        sClientPhoneNum.setValue("");
                        sClientEmail.setValue("");
                    }
                });
            }
            else MessageToast.show("Empty field!");
        },

        //search bar mechanics:
        onSearch: function (oEvent) {
            //select property for searching:
            var actionSelect = this.byId("select").getSelectedItem();

            let searchProperty = "FirstName";
            if (actionSelect.sId == "container-bksoft.frontend---ClientsList--selFN") this.searchProperty = "FirstName";
            else if (actionSelect.sId == "container-bksoft.frontend---ClientsList--selSN") this.searchProperty = "SecondName";
            else if (actionSelect.sId == "container-bksoft.frontend---ClientsList--selPhNum") this.searchProperty = "PhoneNumber";
            else if (actionSelect.sId == "container-bksoft.frontend---ClientsList--selEmail") this.searchProperty = "email";
            console.log(searchProperty);

            var aTableSearchState = [];
            var sQuery = oEvent.getParameter("query");

            if (sQuery && sQuery.length > 0) {
                aTableSearchState = [new Filter(searchProperty, FilterOperator.Contains, sQuery)];
            }
            this._applySearch(aTableSearchState);

        },
        _applySearch: function (aTableSearchState) {
            var oTable = this.byId("ClientsTable");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
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

        //input dialog open and close:
        handleOpen: function () {
            var oDialog = this.getView().byId("inputDialog");
            oDialog.open();
        },
        onClose: function () {
            var oDialog = this.getView().byId("inputDialog");
            oDialog.close();
        },

        //edit dialog open and close:
        editClient: function (oEvent) {
            var oDialog = this.getView().byId("editDialog");
            //get selected client data:
            const oClient = oEvent.getSource().getBindingContext().getObject();
            const oID = oClient.ID;
            editingClientData.clientID = oID;

            const oFirstName = oClient.FirstName;
            editingClientData.clientFN = oFirstName;

            const oSecondName = oClient.SecondName;
            editingClientData.clientSN = oSecondName;

            const oPhoneNum = oClient.PhoneNumber;
            editingClientData.clientPhoneNum = oPhoneNum;

            const oEmail = oClient.email;
            editingClientData.clientEmail = oEmail;

            //get input values from the view:
            const oFNvalue = this.byId("firstnameE");
            const oSNvalue = this.byId("secondnameE");
            const oPhoneNumValue = this.byId("phoneE");
            const oEmailValue = this.byId("emailE");

            //update input values in view:
            oFNvalue.setValue(oFirstName);
            oSNvalue.setValue(oSecondName);
            oPhoneNumValue.setValue(oPhoneNum);
            oEmailValue.setValue(oEmail);
            oDialog.open();
        },
        onCloseEdit: function () {
            var oDialog = this.getView().byId("editDialog");
            oDialog.close();
        },
        onSubmitEdit: async function () {
            const oFNvalue = this.byId("firstnameE").getValue();
            const oSNvalue = this.byId("secondnameE").getValue();
            const oPhoneNumValue = this.byId("phoneE").getValue();
            const oEmailValue = this.byId("emailE").getValue();

            //(ID : UUID, FirstName : String, SecondName : String, PhoneNumber : String, email : String)
            const URLstring = `/catalog/updateClient(ID='` + editingClientData.clientID + `',FirstName='` + oFNvalue + `',SecondName='` + oSNvalue + `',PhoneNumber='` + oPhoneNumValue + `',email='` + oEmailValue + `')`;

            var resHeaders = await fetch(URLstring);
            resHeaders;
            MessageToast.show("client has been updated");
            var oDialog = this.getView().byId("editDialog");
            oDialog.close();
        }
    });
});