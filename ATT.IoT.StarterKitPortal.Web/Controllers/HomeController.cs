using System.Web.Mvc;
using ATT.IoT.StarterKitPortal.Web.Services;

namespace ATT.IoT.StarterKitPortal.Web.Controllers
{
   [HandleCustomError]
    public class HomeController : Controller
    {
        [AppSettings]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetStarted()
        {

            return View();
        }

        public ActionResult LearnMore()
        {
            return View();
        }

    }
}