using System.Configuration;
using System.Linq;
using System.Web.Mvc;

namespace ATT.IoT.StarterKitPortal.Web.Services
{
    public class AppSettingsAttribute : ActionFilterAttribute
    {
        protected string AppKeyPrefix = System.Configuration.ConfigurationManager.AppSettings["AppSettingPrefix"];


        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            var viewResult = filterContext.Result as ViewResult;
            if (viewResult == null)
                return;

            var appKeyPrefix = $"{AppKeyPrefix}:";

            viewResult.ViewBag.AppSettings = ConfigurationManager.AppSettings.AllKeys
                .Where(k=> k.StartsWith(appKeyPrefix))
                .ToDictionary(key => key, key => ConfigurationManager.AppSettings[key]);

            base.OnActionExecuted(filterContext);
        }
    }
}