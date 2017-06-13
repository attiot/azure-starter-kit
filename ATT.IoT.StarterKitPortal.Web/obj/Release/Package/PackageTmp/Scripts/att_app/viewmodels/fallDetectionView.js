ATT.IoT.StarterKitPortal.ViewModels.FallDetection = function (canvasElement) {

    var self = this;
    self.canvasElement = canvasElement;
    self.obdataSource = ko.observableArray([]);
    self.eventdataSource = ko.observableArray([]);
    self.CurrentState = ko.observable("Standing");
    self.PreviousState = ko.observable("Standing");
    self.isNoDataNotified = false;
    self.isNoDeviceNotified = false;

    self.storage = new ATT.IoT.StarterKitPortal.LocalStorageManager();
    self.appSettings = new ATT.IoT.StarterKitPortal.SettingsManager(appSettings);
    self.appInsightsHandler = new ATT.IoT.StarterKitPortal.AppInsightsManager();
    self.toastPanel = new ATT.IoT.StarterKitPortal.ToastPanel();
    self.stickManView = new ATT.IoT.StarterKitPortal.StickMan();
    self.DeviceID = ko.observable(self.storage.getDeviceId());

    self.mapData = function (data) {
        var mappedData = [];
        $.map(data, function (el) {

            mappedData.push(new self.iotItem(el));
        });
        return mappedData;
    };

    self.mapAlert = function (data) {
        var mappedData = [];
        $.map(data, function (el) {
            mappedData.push(new self.alertItem(el));
        });
        return mappedData;
    };

    self.iotItem = function (raw) {

        this.RowKey = raw.RowKey;
        this.time = moment(raw.activitytimestamp).format("h:mm:ss");
        this.activitytimestamp = raw.activitytimestamp;
        this.temp = raw.Temp;
        this.humidity = raw.humidity;
        this.accelx = parseFloat(raw.accelx);
        this.accely = parseFloat(raw.accely);
        this.accelz = parseFloat(raw.accelz);
        this.heatindex = raw.heatindex;
        this.direction = raw.direction == 0 ? "Standing" : raw.direction == 1 ? "Laying Down" : "";
        //this.threshold = 1.9;
        //this.magnitude = Math.sqrt(Math.pow(raw.accelx,2) + Math.pow(raw.accely, 2) + Math.pow(raw.accelz,2));
        //this.magnitude = Math.sqrt(raw.accelx + raw.accelx + raw.accely + raw.accely + raw.accelz + raw.accelz);
    };

    self.alertItem = function (raw) {
        this.Date = moment(raw.activitytimestamp).format("MM/DD/YYYY");
        this.Time = moment(raw.activitytimestamp).format("h:mm:ss");
        this.activitytimestamp = raw.activitytimestamp;
        this.action = parseInt(raw.action) == 0 ? "Stood" : parseInt(raw.action) == 2 ? "Fell" : "Laid Down";
        this.accelx = parseFloat(raw.accelx);
        this.accely = parseFloat(raw.accely);
        this.accelz = parseFloat(raw.accelz);
    };
    
    self.poll_interval = 0;

    self.poll = function () {
        if (self.DeviceID() != undefined) {

            $.when($.getJSON(self.appSettings.FallDashBoardServiceUrl(self.DeviceID())),
                    $.getJSON(self.appSettings.FallDashBoardAlertServiceUrl(self.DeviceID())))
                .then(function(rawStream, actions) {

                    var d = rawStream[0].value;
                    d.sort(function(a, b) {
                        var dtA = moment(a.activitytimestamp);
                        var dtB = moment(b.activitytimestamp);
                        return dtA.isBefore(dtB) ? -1 : dtA.isAfter(dtB) ? 1 : 0;
                    });


                    var e = actions[0].value;
                    var eventData = self.mapAlert(e);

                    self.eventdataSource(eventData);
                    var newData = self.mapData(d);

                    var newState = "";

                    var latestStream = (newData != null && newData.length > 0) ? newData[newData.length - 1] : null;
                    var latestEvent = (newData != null && newData.length > 0) ? eventData[0] : null;

                    if (latestEvent != null) {

                        if (latestStream != null) {

                            if (moment(latestStream.activitytimestamp)
                                .diff(moment(latestEvent.activitytimestamp), 'seconds') >
                                60) {
                                newState = latestStream.direction;
                            } else {
                                newState = latestEvent.action;
                            }
                        } else {
                            newState = latestEvent.action;
                        }
                    } else if (latestStream != null) {

                        newState = latestStream.direction;
                    }

                    self.PreviousState(viewModel.CurrentState());
                    self.CurrentState(newState);

                    if (self.PreviousState() != self.CurrentState()) {
                        if (newState == "Fell") {
                            self.stickManView.fall();
                        } else if (newState == "Standing" || newState == "Stood") {
                            self.stickManView.stand();
                        } else if (newState == "Laying Down" || newState == "Laid Down") {
                            self.stickManView.lieDown();
                        }
                    }

                    var newTop = null;
                    var oldTop = null;
                    if (newData != null && newData.length > 0) {
                        newTop = newData[newData.length - 1].RowKey;
                    }

                    if (self.obdataSource() != null && self.obdataSource().length > 0) {
                        oldTop = self.obdataSource()[self.obdataSource().length - 1].RowKey;
                    }

                    if (newTop !== oldTop) {
                        self.obdataSource(newData);

                        ////Remove old data points
                        self.chart.data.labels.length = 0;
                        self.chart.data.datasets[0].data.length = 0;
                        self.chart.data.datasets[1].data.length = 0;
                        self.chart.data.datasets[2].data.length = 0;
                        
                        //Format new data points
                        var timeaxis = newData.map(function(a) { return a.time; });
                        var xaxis = newData.map(function(a) { return a.accelx; });
                        var yaxis = newData.map(function(a) { return a.accely; });
                        var zaxis = newData.map(function(a) { return a.accelz; });
                       
                        //Load new data points
                        self.chart.data.labels = timeaxis;
                        self.chart.data.datasets[0].data = xaxis;
                        self.chart.data.datasets[1].data = yaxis;
                        self.chart.data.datasets[2].data = zaxis;
                        self.chart.update();
                    }

                    //Set interval
                    self.poll_interval = 2000;

                    if (!$('#att-unitTest-element').is(':visible')) {
                        // Code
                        $("#att-unitTest-element").show();
                    }

                }).done(function() {
                    //TODO: enable timeout for polling server
                    setTimeout(self.poll, self.poll_interval);
                });
        }
    };

    var canvas = document.getElementById(canvasElement),
        ctx = canvas.getContext('2d');

    self.chart = new Chart(ctx,
        {
            type: "line",
            tension: 0,
            backgroundColor: "#efefef",
            animationSteps: 15,
            options: {
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 15,
                                maxRotation: 0
                            }
                        }
                    ],
                    yAxes: [{
                        gridLines: {
                            display: true,
                            color: "#fff"
                        }
                    }]
                },
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 10
                    }
                }
            },
            data: {
                labels: [],
                datasets: [
                {
                    label: "X-AXIS",
                    pointBackgroundColor: "rgba(129, 188, 6, 1)",
                    borderColor: "rgba(129, 188, 6, 1)",
                    data: [],
                    tension: 0,
                    radius: 5,
                    pointBackgroundColor: "#000",
                    pointBorderWidth: 2

                },
                {
                    label: "Y-AXIS",
                    pointBackgroundColor: "rgba(255, 186, 8, 1)",
                    borderColor: "rgba(255, 186, 8, 1)",
                    data: [],
                    tension: 0,
                    radius: 5,
                    pointBackgroundColor: "#000",
                    pointBorderWidth: 2
                },
                {
                    label: "Z-AXIS",
                    pointBackgroundColor: "rgba(243, 83, 37, 1)",
                    borderColor: "rgba(243, 83, 37, 1)",
                    data: [],
                    tension: 0,
                    radius: 5,
                    pointBackgroundColor: "#000",
                    pointBorderWidth: 2
                }
            ]
        }
    });


    //Global Chart Config
    Chart.defaults.global.defaultFontColor = "#fff";
    //Chart.defaults.global.defaultFontSize = 20;
    Chart.defaults.global.legend.position = "bottom";
    Chart.defaults.global.elements.point.radius = 5;
};