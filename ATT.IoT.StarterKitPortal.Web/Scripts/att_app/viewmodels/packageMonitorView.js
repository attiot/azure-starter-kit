ATT.IoT.StarterKitPortal.ViewModels.PackageMonitor = function(magnitudeCanvas, accelerometerCanvas) {
    var self = this;
    self.magnitudeCanvas = magnitudeCanvas;
    self.accelerometerCanvas = accelerometerCanvas;
    self.obdataSource = ko.observableArray([]);
    self.eventdataSource = ko.observableArray([]);
    self.storage = new ATT.IoT.StarterKitPortal.LocalStorageManager();
    self.appSettings = new ATT.IoT.StarterKitPortal.SettingsManager(appSettings);
    self.appInsightsHandler = new ATT.IoT.StarterKitPortal.AppInsightsManager();
    self.toastPanel = new ATT.IoT.StarterKitPortal.ToastPanel();
    self.isNoDataNotified = false;
    self.isNoDeviceNotified = false;
    self.DeviceID = ko.observable(self.storage.getDeviceId());

    self.mapData = function(data) {
        var mappedData = [];

        $.map(data,
            function(el) {

                mappedData.push(new self.iotItem(el));
            });

        return mappedData;
    }

    self.mapAlert = function(data) {

        var mappedData = [];

        $.map(data,
            function(el) {

                mappedData.push(new self.alertItem(el));
            });

        return mappedData;
    }

    self.alertItem = function(raw) {
        this.Date = moment(raw.activitytimestamp).format("MM/DD/YYYY");
        this.Time = moment(raw.activitytimestamp).format("h:mm:ss");
        this.activitytimestamp = raw.activitytimestamp;
        this.accelx = parseFloat(raw.accelx);
        this.accely = parseFloat(raw.accely);
        this.accelz = parseFloat(raw.accelz);
        this.magnitude = parseFloat(raw.magnitude);
        this.impact = (this.magnitude <= 3.5)
            ? "Small"
            : (this.magnitude > 3.5 && this.magnitude <= 5) ? "Medium" : "Large";

    }

    self.iotItem = function(raw) {

        this.RowKey = raw.RowKey;
        this.activitytimestamp = raw.activitytimestamp;
        this.temp = raw.Temp;
        this.humidity = raw.humidity;
        this.accelx = parseFloat(raw.accelx);
        this.accely = parseFloat(raw.accely);
        this.accelz = parseFloat(raw.accelz);
        this.heatindex = raw.heatindex;
        this.threshold = 2.2;
        this.magnitude = parseFloat(raw.magnitude);
        this.time = moment(raw.activitytimestamp).format("h:mm:ss");

        //this.magnitude = Math.sqrt(Math.pow(raw.accelx,2) + Math.pow(raw.accely, 2) + Math.pow(raw.accelz,2));
        //this.magnitude = Math.sqrt(raw.accelx + raw.accelx + raw.accely + raw.accely + raw.accelz + raw.accelz);
    }

    self.updateAccelerometer = function(accelData) {
        //Remove old data points
        self.acelerometerChart.data.labels.length = 0;
        self.acelerometerChart.data.datasets[0].data.length = 0;
        self.acelerometerChart.data.datasets[1].data.length = 0;
        self.acelerometerChart.data.datasets[2].data.length = 0;

        //Format new data points
        var timeaxis = accelData.map(function (a) { return a.time; });
        var xaxis = accelData.map(function (a) { return a.accelx; });
        var yaxis = accelData.map(function (a) { return a.accely; });
        var zaxis = accelData.map(function (a) { return a.accelz; });

        //Load new data points
        self.acelerometerChart.data.labels = timeaxis;
        self.acelerometerChart.data.datasets[0].data = xaxis;
        self.acelerometerChart.data.datasets[1].data = yaxis;
        self.acelerometerChart.data.datasets[2].data = zaxis;
        self.acelerometerChart.update();
    }

    self.updateMagnitude = function (magnitudeData) {
        //Remove old data points
        self.magnitudeChart.data.labels.length = 0;
        self.magnitudeChart.data.datasets[0].data.length = 0;
        self.magnitudeChart.data.datasets[1].data.length = 0;

        //Format new data points
        var timeaxis = magnitudeData.map(function (a) { return a.time; });
        var magnitude = magnitudeData.map(function (a) { return a.magnitude; });
        var threshold = magnitudeData.map(function (a) { return a.threshold; });

        //Load new data points
        self.magnitudeChart.data.labels = timeaxis;
        self.magnitudeChart.data.datasets[0].data = magnitude;
        self.magnitudeChart.data.datasets[1].data = threshold;
        self.magnitudeChart.update();
    }

    self.poll = function() {

        if (viewModel.DeviceID() != undefined) {
            var poll_interval = 0;


            $.when($.getJSON(self.appSettings.PackageDashBoardServiceUrl(self.DeviceID())),
                    $.getJSON(self.appSettings.PackageDashBoardAlertServiceUrl(self.DeviceID())))
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

                        self.updateAccelerometer(newData);
                        self.updateMagnitude(newData);
                    }

                    poll_interval = 2000;

                }).done(function() {

                    setTimeout(self.poll, poll_interval);
                });

        }
    }

    var accelCanvas = document.getElementById(accelerometerCanvas),
        accelCtx = accelCanvas.getContext('2d');

    self.acelerometerChart = new Chart(accelCtx,
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
                                maxTicksLimit: 10,
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

    var magCanvas = document.getElementById(magnitudeCanvas),
      magnitudeCtx = magCanvas.getContext('2d');

    self.magnitudeChart = new Chart(magnitudeCtx,
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
                              maxTicksLimit: 10,
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
                  label: "MAGNITUDE",
                  pointBackgroundColor: "rgba(0, 159, 219, 1)",
                  borderColor: "rgba(0, 159, 219, 1)",
                  data: [],
                  tension: 0,
                  radius: 5,
                  pointBackgroundColor: "#000",
                  pointBorderWidth: 2

              },
              {
                  label: "THRESHOLD",
                  pointBackgroundColor: "rgba(171, 52, 52, 1)",
                  borderColor: "rgba(171, 52, 52, 1)",
                  data: [],
                  tension: 0,
                  radius: 0,
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
}



