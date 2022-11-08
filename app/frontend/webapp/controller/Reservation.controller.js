sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/unified/DateRange', 'sap/m/MessageToast', 'sap/ui/core/format/DateFormat', 'sap/ui/core/library', 'sap/ui/core/routing/History', 'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',],
    function (Controller, DateRange, MessageToast, DateFormat, coreLibrary, Filter, FilterOperator) {
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
            navHome: function () {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainView");
            },

            //New reservation Dialog:
            newResOpen: function () {
                var oDialog = this.getView().byId("newResDialog");
                oDialog.open();
            },
            onCloseNewRes: function () {
                var oDialog = this.getView().byId("newResDialog");
                oDialog.close();
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
                //function that gets all data of selected client and puts it into ReservationData object

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
            getDataTest: async function () {
                function monthToInt(monthTxt) {
                    switch (monthTxt) {
                        case "Jan": return 1;
                        case "Feb": return 2;
                        case "Mar": return 3;
                        case "Apr": return 4;
                        case "May": return 5;
                        case "Jun": return 6;
                        case "Jul": return 7;
                        case "Aug": return 8;
                        case "Sep": return 9;
                        case "Oct": return 10;
                        case "Nov": return 11;
                        case "Dec": return 12;
                    }
                }

                //function that change data format to proper format for fetch request
                function changeDateFormat(date) {
                    var result;
                    var year = String(date).slice(11, 15);
                    var month = String(date).slice(4, 7);
                    var day = String(date).slice(8, 10);
                    result = String(year + "-" + monthToInt(month) + "-" + day + " 00:00:00");
                    return result;
                }

                //checking if any input is empty
                if (ReservationData.clientID !== " " && ReservationData.startDate !== " " && ReservationData.endDate !== " ") {
                    alert(ReservationData.clientID);
                    console.log(ReservationData.clientID);
                    console.log(ReservationData.clientFN);
                    console.log(ReservationData.clientSN);
                    console.log(ReservationData.startDate);
                    console.log(ReservationData.endDate);
                }
                else MessageToast.show("Empty field!");

                //changing format of start date and end date for get request
                var dateStartARG = changeDateFormat(ReservationData.startDate);
                var dateEndARG = changeDateFormat(ReservationData.endDate);
                console.log(dateStartARG);

                //get request for getting all available beds
                const URLstring = `/catalog/getVacancy(dateStart='` + dateStartARG + `',dateEnd='` + dateEndARG + `')`
                var resHeaders = await fetch(URLstring);
                resHeaders;
            },
            //searching for client:
            onSearch: function (oEvent) {
                if (oEvent.getParameters().refreshButtonPressed) {
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
            //####################
        });

    });
