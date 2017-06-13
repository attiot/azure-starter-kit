ATT.IoT.StarterKitPortal.ViewModels.Login = function () {
    var self = this;
    var storage = new ATT.IoT.StarterKitPortal.LocalStorageManager();
    self.appSettings = new ATT.IoT.StarterKitPortal.SettingsManager(appSettings);
    self.appInsightsHandler = new ATT.IoT.StarterKitPortal.AppInsightsManager();
    self.toastPanel = new ATT.IoT.StarterKitPortal.ToastPanel();

    //Observables
    self.iccID = ko.observable();
    self.SplashScreenUrl = ko.observable("/Content/images/StarterKit.jpg");

    //Service Calls
    self.validateDevice = function ()
    {
        if (self.iccID()) {

            $.ajax({
                type: "GET",
                dataType: "json",
                url: self.appSettings.ValidDeviceServiceUrl(self.iccID()),
                success: loadDashboard,
                failure: logFailure
            });
        }
        else {
            self.toastPanel.Warning("Please provide your SIM ICC ID to get started.");
        }
      
    }

    function loadDashboard(data)
    {
        
        if (data.value && data.value.length == 1)
        {
            self.storeDeviceID(self.iccID());
            var url = "/Dashboard/FallDetection";
            window.location.href = url;
        }
        else
        {
          //  self.toastPanel.calloutError("Error Occured!", "Starter Kit has been integrated with AT&T Flow.")

          self.toastPanel.Error("Sorry, no data found for your device. Please ensure that the "+
                              "Starter Kit has been integrated with AT&T Flow.");
        }
    }

    function logFailure(err)
    {
        self.toastPanel.Error("Sorry, there was problem retrieving dashboard data for your device.");
        self.appInsightsHandler.sendException(err,"Portal Login", "Error Validating ICC Device ID");

    }

    // Local Storage Manager for Devide ICC ID
    self.storeDeviceID = function(deviceId) {
        var deviceidinStorage = storage.getDeviceId();
        if (deviceidinStorage !== deviceId) {
            storage.setDeviceId(deviceId);
        }
    }

    //Pre-populate device ICC ID from local storage
    if (storage.getDeviceId() != null)
    {
        self.iccID(storage.getDeviceId());
    }
};