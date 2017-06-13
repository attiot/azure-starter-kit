using Microsoft.Azure;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Linq;
using ATT.IoT.StarterKitPortal.Data.Models;

namespace ATT.IoT.StarterKitPortal.Data
{

    public class IoTDataContext
    {
        protected string connectionString = CloudConfigurationManager.GetSetting("StorageConnectionString");
        protected string tableName = CloudConfigurationManager.GetSetting("StorageTableName");
        protected CloudStorageAccount storageAccount;
        protected CloudTableClient tableClient;
        protected CloudTable table;
        public IoTDataContext()
        {
            this.storageAccount = CloudStorageAccount.Parse(connectionString);
            this.tableClient = storageAccount.CreateCloudTableClient();
            this.table = tableClient.GetTableReference(tableName);
            this.table.CreateIfNotExists();
        }

        public TelemetryResult TelemetryStream(string id, int? top, string nextRowKey)
        {
       
            TableQuery query = new TableQuery()
                .Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, id));

            if (top.HasValue && top.Value > 0)
            {
                query.Take(top.Value);
            }

            TableContinuationToken tableContinuationToken = new TableContinuationToken();
            if (!string.IsNullOrEmpty(nextRowKey))
            {
                tableContinuationToken.NextPartitionKey = id;
                tableContinuationToken.NextRowKey = nextRowKey;
            }
            var results = table.ExecuteQuerySegmented(query, tableContinuationToken);

            return new TelemetryResult()
            {
                NextRowKey = results.ContinuationToken != null ? results.ContinuationToken.NextRowKey : string.Empty,
                Results = results.Results.OrderBy(r => r.Properties["activitytimestamp"].DateTimeOffsetValue).ToList()
            };

        }

    }
}
