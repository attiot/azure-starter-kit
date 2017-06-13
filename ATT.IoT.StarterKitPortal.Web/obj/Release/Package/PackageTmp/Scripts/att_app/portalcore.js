
// Creating JS Namespace 
var ATT = ATT || {};
ATT.IoT = ATT.IoT || {};
ATT.IoT.StarterKitPortal = ATT.IoT.StarterKitPortal || {};

// Creating ATT JS namespaces for modules
ATT.IoT.StarterKitPortal.ViewModels = ATT.IoT.StarterKitPortal.ViewModels || {};
ATT.IoT.StarterKitPortal.DataSets = ATT.IoT.StarterKitPortal.DataSets || {};
ATT.IoT.StarterKitPortal.StickMan = ATT.IoT.StarterKitPortal.StickMan || {};
ATT.IoT.StarterKitPortal.SettingsManager = ATT.IoT.StarterKitPortal.SettingsManager || {};

// Storage Manager
ATT.IoT.StarterKitPortal.LocalStorageManager = function () {

    var storage = window.localStorage;

    function getDeviceId() {
        return (get("ATTIoTStarterKitDeviceId"));
    }

    function setDeviceId(id) {
        set("ATTIoTStarterKitDeviceId", id);
    }

    function get(key) {
        var value = storage.getItem(key);
        return value;
    }

    function set(key, value) {
        storage.setItem(key, value);
         //appInsights.setAuthenticatedUserContext("ICCID: "+id)
    }

    return {
        getDeviceId: getDeviceId,
        setDeviceId: setDeviceId,
        set: set,
        get: get
    };
}

// AppInsights Manager
ATT.IoT.StarterKitPortal.AppInsightsManager = function()
{
    var self = this;
    var localstorage = new ATT.IoT.StarterKitPortal.LocalStorageManager();
    var deviceid = localstorage.getDeviceId();

    // Not Used currently. Future Use
    //e.g. sendTrace("Alert Detected","Fall Detection","Stream Analytics Data")
    self.sendTrace = function (event, dashboard, message) {
        var traceData = {}
        if (dashboard !== null && dashboard !== undefined) {
            traceData.DashboardPage = dashboard;
        }
        if (message !== null && message !== undefined) {
            traceData.LogMessage = message;
        }
        if (deviceid !== null && deviceid !== undefined) {
            traceData.ICCID = deviceid;
        }
        appInsights.trackTrace(event, traceData);
    };

self.trackPageView= function(pageName) { 

       var pageviewData = {}
       var url = location.href;
       
       if (deviceid !== null && deviceid !== undefined) {
           pageviewData.ICCID = deviceid;
       }
       
       appInsights.trackPageView(pageName, url, pageviewData);

     } 


    //e.g. sendException(ex,"Fall Detection","Polling - No Data found")
    self.sendException = function (exception, dashboard, errorlocation) {
        var excepData = {}
        if (dashboard !== null && dashboard !== undefined) {
            excepData.DashboardPage = dashboard;
        }

        if (errorlocation !== null && errorlocation !== undefined) {
            excepData.ErrorLocation = errorlocation;
        }

        if (deviceid !== null && deviceid !== undefined) {
            excepData.ICCID = deviceid;
        }

        appInsights.trackException(exception, dashboard, excepData);
    };
}

//Error,Warnings, Success Toast Notifications
ATT.IoT.StarterKitPortal.ToastPanel = function () {
    'use strict';
    var self = this;
    var panel = "#att-toast-panel";

    self.Success = function (message) {
        var node = $('<div data-alert class="alert-box info" id="att-toast-message"></div>');
        node[0].innerHTML = message + '<a href="#" class="close">&times;</a>';
        $(panel).append(node);
        $(document).foundation();
    };

    self.Warning = function (message) {
        var node = $('<div data-alert class="alert-box warning" id="att-toast-message"></div>');
        node[0].innerHTML = message + '<a href="#" class="close">&times;</a>';
        $(panel).append(node);
        $(document).foundation();
    };

    self.Error = function (message) {
        var node = $('<div data-alert class="alert-box alert" id="att-toast-message"></div>');
        node[0].innerHTML = message + '<a href="#" class="close">&times;</a>';
        $(panel).append(node);
        $(document).foundation();
    };

    self.calloutError = function (title, errorMessage) {
        var element = $("<div data-closable/>").addClass("callout").addClass("alert").addClass("att-callout"),
            title = $("<h3/>").text(title),
            message = $("<p/>").text(errorMessage),
            button = $("<button data-close/>").addClass("close-button").attr("aria-label", "Close Error").attr("type", "button"),
            span = $("<span/>").html("&times;").attr("aria-hidden", "true");
        element.append(title);
        element.append(message);
        element.append(button);
        button.append(span);
        $(panel).append(element);

    };
}

//App Config Settings Wrapper
ATT.IoT.StarterKitPortal.SettingsManager = function (settings) {
    var self = this;
    self.settings = settings;
    self.BaseServiceUrlFormat = function () {
        return self.getSetting("IoT:TableServiceUrl") + "%TABLE%?%QUERY%&" + self.SASToken();
    };
    self.SASToken = function () {
        return self.getSetting("IoT:SASToken");
    };
    self.StreamTable = function () {
        return self.getSetting("IoT:StreamTable");
    };
    self.AlertTable = function () {
        return self.getSetting("IoT:AlertTable");
    };
    self.ValidDeviceServiceUrl = function (deviceId) {

        return self.BaseServiceUrlFormat().replace("%TABLE%", self.StreamTable()).replace("%QUERY%", self.getSetting("IoT:ValidDeviceQuery").replace("%DEVICEID%", deviceId));
    };
    self.FallDashBoardServiceUrl = function (deviceId) {

        return self.BaseServiceUrlFormat().replace("%TABLE%", self.StreamTable()).replace("%QUERY%", self.getSetting("IoT:FallDashBoardStreamQuery").replace("%DEVICEID%", deviceId));
    };
    self.PackageDashBoardServiceUrl = function (deviceId) {

        return self.BaseServiceUrlFormat().replace("%TABLE%", self.StreamTable()).replace("%QUERY%", self.getSetting("IoT:PackageDashBoardStreamQuery").replace("%DEVICEID%", deviceId));
    };

    self.FallDashBoardAlertServiceUrl = function (deviceId) {

        return self.BaseServiceUrlFormat().replace("%TABLE%", self.AlertTable()).replace("%QUERY%", self.getSetting("IoT:FallDashBoardAlertQuery").replace("%DEVICEID%", deviceId));
    };
    self.PackageDashBoardAlertServiceUrl = function (deviceId) {

        return self.BaseServiceUrlFormat().replace("%TABLE%", self.StreamTable()).replace("%QUERY%", self.getSetting("IoT:PackageDashBoardAlertQuery").replace("%DEVICEID%", deviceId));
    };
    self.getSetting = function (key) {
        return self.settings[key].toString();
    };
};