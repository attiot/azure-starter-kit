using System.Web.Mvc;
using ATT.IoT.StarterKitPortal.Web.Services;

namespace ATT.IoT.StarterKitPortal.Web.Controllers
{
    [HandleCustomError]
    [AppSettings]
    public class DashboardController : Controller
    {
        public ActionResult FallDetection()
        {
            return View();
        }

        public ActionResult PackageMonitor()
        {
            return View();
        }

    }
}