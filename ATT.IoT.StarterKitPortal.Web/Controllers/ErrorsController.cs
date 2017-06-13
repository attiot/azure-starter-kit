using System.Web.Mvc;

namespace ATT.IoT.StarterKitPortal.Web.Controllers
{
    public class ErrorsController : Controller
    {
        public virtual ActionResult Error()
        {
            return View();
        }

     
    }
}