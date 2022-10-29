sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/m/MessageToast', 'sap/ui/core/format/DateFormat', 'sap/ui/core/library', 'sap/ui/core/routing/History'],
    function (Controller, DateRange, MessageToast, DateFormat, coreLibrary, History) {
        "use strict";

        var CalendarType = coreLibrary.CalendarType;
        let ReservationData = {
            clientID: " ",
            clientFN: " ",
            clientSN: " ",
            startDate: " ",
            endDate: " "
        }

        return Controller.extend("bksoft.frontend.controller.Reservation", {
            oFormatYyyymmdd: null,

            onInit: function () {
                this.oFormatYyyymmdd = DateFormat.getInstance({ pattern: "yyyy-MM-dd", calendarType: CalendarType.Gregorian });
            },

            handleCalendarSelect: function (oEvent) {
                var oCalendar = oEvent.getSource();
                this._updateText(oCalendar.getSelectedDates()[0]);
            },

            _updateText: function (oSelectedDates) {
                var oSelectedDateFrom = this.byId("selectedDateFrom"),
                    oSelectedDateTo = this.byId("selectedDateTo"),
                    oDate;

                if (oSelectedDates) {
                    oDate = oSelectedDates.getStartDate();
                    if (oDate) {
                        oSelectedDateFrom.setText(this.oFormatYyyymmdd.format(oDate));
                        ReservationData.startDate = oDate;
                    } else {
                        oSelectedDateTo.setText("No Date Selected");
                    }
                    oDate = oSelectedDates.getEndDate();
                    if (oDate) {
                        oSelectedDateTo.setText(this.oFormatYyyymmdd.format(oDate));
                        ReservationData.endDate = oDate;
                    } else {
                        oSelectedDateTo.setText("No Date Selected");
                    }
                } else {
                    oSelectedDateFrom.setText("No Date Selected");
                    oSelectedDateTo.setText("No Date Selected");
                }
            },

            handleSelectThisWeek: function () {
                this._selectWeekInterval(6);
            },

            handleSelectWorkWeek: function () {
                this._selectWeekInterval(4);
            },

            handleWeekNumberSelect: function (oEvent) {
                var oDateRange = oEvent.getParameter("weekDays"),
                    iWeekNumber = oEvent.getParameter("weekNumber");

                if (iWeekNumber % 5 === 0) {
                    oEvent.preventDefault();
                    MessageToast.show("You are not allowed to select this calendar week!");
                } else {
                    this._updateText(oDateRange);
                }
            },

            _selectWeekInterval: function (iDays) {
                var oCurrent = new Date(), // get current date
                    iWeekStart = oCurrent.getDate() - oCurrent.getDay() + 1,
                    iWeekEnd = iWeekStart + iDays, // end day is the first day + 6
                    oMonday = new Date(oCurrent.setDate(iWeekStart)),
                    oSunday = new Date(oCurrent.setDate(iWeekEnd)),
                    oCalendar = this.byId("calendar");

                oCalendar.removeAllSelectedDates();
                oCalendar.addSelectedDate(new DateRange({ startDate: oMonday, endDate: oSunday }));

                this._updateText(oCalendar.getSelectedDates()[0]);
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

            //Select client Dialog:
            onShowClientsList: function () {
                const oDialog = this.getView().byId("clientsListDialog");
                oDialog.open();
            },
            onCloseDialog: function () {
                const oDialog = this.getView().byId("clientsListDialog");
                oDialog.close();
            },
            onClientSelect: function (oEvent) {
                const oClient = oEvent.getSource().getBindingContext().getObject();
                const oID = oClient.ID;
                ReservationData.clientID = oID;
                const oFirstName = oClient.FirstName;
                ReservationData.clientFN = oFirstName;
                const oSecondName = oClient.SecondName;
                ReservationData.clientSN = oSecondName;
                const oSelectedClient = this.byId("selectedClientL");

                MessageToast.show("Selected " + oFirstName + " " + oSecondName);
                oSelectedClient.setText(oFirstName + " " + oSecondName);

                const oDialog = this.getView().byId("clientsListDialog");
                oDialog.close();
            },
            getDataTest: function () {
                if (ReservationData.clientID !== " " && ReservationData.startDate !== " " && ReservationData.endDate !== " ") {
                    alert(ReservationData.clientID);
                    console.log(ReservationData.clientID);
                    console.log(ReservationData.clientFN);
                    console.log(ReservationData.clientSN);
                    console.log(ReservationData.startDate);
                    console.log(ReservationData.endDate);
                }
                else MessageToast.show("Empty field!")
            }
        });

    });
