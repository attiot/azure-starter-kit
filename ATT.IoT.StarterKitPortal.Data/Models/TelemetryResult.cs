using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;

namespace ATT.IoT.StarterKitPortal.Data.Models
{
    public class TelemetryResult
    {
        public string NextRowKey { get; set; }
        public List<DynamicTableEntity> Results { get; set; }
    }
}
