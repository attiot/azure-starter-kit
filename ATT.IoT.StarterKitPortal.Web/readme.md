# AT&T IoT Starter Kit Dashboard Quick Start

## Getting Started 
The following Azure resources and application specific configuration settings need to be in place in order to run the AT&T IoT Starter Kit solution in your own Azure subscription.As an overview of the solution 
an AT&T IoT Starter Kit device sends telemetry to an AT&T Flow instance.  The Flow instance then sends the telemetry message downstream to the Azure IoT Hub.  Azure Stream Analytics pulls messages off of the IoT
Hub and processes them determining what alerts if any need to be dispatched.  Telemetry messages end up in one of two tables within Azure Table Storage.  The Azure App Service then surfaces the data in these tables
to the quick start dashboards.

The following is a high level reference architecture of the starter kit solution.

![alt tag](https://attiotportaldev.azurewebsites.net/Content/images/Architecture/ATT_IoTStarterKit_Architecture.png)

## Flow Setup
1. Create a AT&T Flow account to get started https://flow.att.com/
2. Fork the Starter Kit Reference project
3. Configure an Azure IoT Hub node to point to your Azure IoT Hub (see below)

## Azure Resources
Create and configure the following Azure resouces:
- IoT Hub
- Stream Analytics
- Storage Account
- App Service
- Application Insights

## Configure Azure Resources

### Stream Analytics Configuration

##### Inputs 
Add a new input with the IoT Hub source type.  Default settings are sufficient.

##### Outputs
Add two new outputs with the Sink of Table Storage.  For each output configure either the raw telemetry table or alerts table (see settings below) 

##### Query

Add the following query to the stream analytics job.  The query includes a singlt input and two outputs.  Modify the query to match the input and outputs created above.
```
WITH ACTIONS AS
(
     SELECT PartitionKey,
            ActivityTimestamp, 
            AccelX, 
            AccelY, 
            AccelZ, 
            SQRT(POWER(AccelX,2) + POWER(AccelY,2) + POWER(AccelZ,2)) as Magnitude,
            PreviousAccelY = (LAG(AccelY, 1) OVER (PARTITION BY PartitionKey LIMIT DURATION(second, 3)))
     FROM [ATTIoTStarterKitDevInput] TIMESTAMP BY ActivityTimestamp
)

SELECT
    PartitionKey, RowKey, ActivityTimestamp, Temp, Humidity, AccelX, AccelY, AccelZ, HeatIndex
    , SQRT(POWER(AccelX,2) + POWER(AccelY,2) + POWER(AccelZ,2)) as Magnitude
    , case
         when AccelY >= 0.8 then 0 -- standing
         when AccelY <= 0.79 then 1 -- laying down
         else -1
      end as Direction
INTO
    [ATTIoTStarterKitDevRawOutput]
FROM
    [ATTIoTStarterKitDevInput] TIMESTAMP BY ActivityTimestamp

SELECT * 
Into
[ATTIoTStarterKitDevAlertsOutput]
FROM
(SELECT PartitionKey, cast(9999999999 - DATEDIFF(s,cast('1970-01-01 12:00:00' as datetime), System.Timestamp) as nvarchar(max)) as RowKey,
    case
        when AccelY >= 0.8 AND PreviousAccelY <= .79 then 0 -- stood
        when PreviousAccelY >= 0.8 and PreviousAccelY - AccelY < 0.5 then 1 --laid down
        when PreviousAccelY >= 0.8 and PreviousAccelY - AccelY >= 0.5 then 2 -- fell
        else -1 --
    end as Action,ActivityTimestamp, AccelX, AccelY, AccelZ, Magnitude
FROM ACTIONS
WHERE (AccelY >= 0.8 AND  PreviousAccelY <= .79)  --laying down to standing      
      OR (AccelY <= 0.79 AND  PreviousAccelY >= .80)  --standing to laying down
) as ActionSum
```


## Application Settings (web.config)
Update the following settings in the web.confg file for your specific environment:

 - **`StorageConnectionString`** The connection string to your Azure storage account.
 
   >DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="
 - **`StorageTableName`** The name of the storage table where telemetry will be stored 
   
   >Ex. ATTIoTStarterKitDevRawTbl
 - **`IoT:TableServiceUrl`** The url for the Table service

    >Ex. http://127.0.0.1:10002/devstoreaccount1/

- **`IoT:SASToken`** The SAS key generated for the Azure storage account.

    > sv=2015-04-05&amp;sig=1ubYFgIDcN%2Fr0KvMvcpS04KJvOqvMl794mQs6kQTyGY%3D&amp;se=2017-03-20T16%3A53%3A29Z&amp;srt=sco&amp;ss=bfqt&amp;sp=racupwdl
- **`IoT:StreamTable`** The formatted name of the table for telemetry.

    >Ex. ATTIoTStarterKitDevRawTbl()
- **`IoT:AlertTable`** The formatted name of the table for alerts.

    > Ex. ATTIoTStarterKitDevAlertsTbl()

- **`ATTIoTAppInsights`** The application insights API key.

  >Ex. abcd2580-9a77-4532-83d8-7032b1112345