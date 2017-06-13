using System.Web.Mvc;
using ATT.IoT.StarterKitPortal.Data;
using ATT.IoT.StarterKitPortal.Data.JsonConverters;
using Newtonsoft.Json;
using ATT.IoT.StarterKitPortal.Web.Services;

namespace ATT.IoT.StarterKitPortal.Web.Controllers
{
    [HandleCustomError]
    public class TelemetryController : Controller
    {
        [Route("data/{id}")]
        public ActionResult Index(string id, int? top, string continuationToken)
        {
            var result = string.Empty;
    
            if (!string.IsNullOrEmpty(id))
            {
                var telemetryResult = new IoTDataContext().TelemetryStream(id, top, continuationToken);

                if (telemetryResult != null)
                {
                    result = JsonConvert.SerializeObject(telemetryResult.Results,
                                                Formatting.None,
                                                new DynamicTelemetryEntityConverter());

                    if (!string.IsNullOrEmpty(telemetryResult.NextRowKey))
                    {
                        this.HttpContext.Response.AddHeader("x-ContinuationToken", telemetryResult.NextRowKey);
                    }
                }
            }
            return Content(result,"application/json");
        }
    }
}