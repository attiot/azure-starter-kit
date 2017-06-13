using System.Web.Mvc;

namespace ATT.IoT.StarterKitPortal.Web.Services
{
    public class HandleCustomErrorAttribute : System.Web.Mvc.HandleErrorAttribute
    {
        public override void OnException(System.Web.Mvc.ExceptionContext filterContext)
        {
            //If the exeption is already handled
            if (filterContext.ExceptionHandled)
            {
                return;
            }
            else
            {
                string actionName = filterContext.RouteData.Values["action"].ToString();
                string controllerName = (string)filterContext.RouteData.Values["controller"];
                //Type controllerType = filterContext.Controller.GetType();
                //var method = controllerType.GetMethod(actionName);
                //var returnType = method.ReturnType;

                HandleErrorInfo model = new HandleErrorInfo(filterContext.Exception, controllerName, actionName);
                filterContext.Result = new ViewResult
                {
                   ViewName = "Error",
                   ViewData = new ViewDataDictionary<HandleErrorInfo>(model)
                };
        


            }

            filterContext.ExceptionHandled = true;
        }
    }
}