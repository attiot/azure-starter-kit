using System.Web.Optimization;

namespace ATT.IoT.StarterKitPortal.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            #region ATTStarterKit Bundles


            bundles.Add(new ScriptBundle("~/bundles/appJS").Include(
                    "~/Scripts/knockout-3.4.0.js",
                    "~/Scripts/att_app/portalcore.js",
                    "~/Scripts/moment.js"
                )
                .IncludeDirectory("~/Scripts/att_app/stickman/", "*.js")
                .IncludeDirectory("~/Scripts/att_app/viewmodels/", "*.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/attstyle.css"
            ));

            #endregion

            #region Foundation Bundles

            bundles.Add(new ScriptBundle("~/bundles/foundation").Include(
                "~/Scripts/foundation/fastclick.js",
                "~/Scripts/jquery.cookie.js",
                "~/Scripts/foundation/foundation.js",
                "~/Scripts/foundation/foundation.*",
                "~/Scripts/foundation/app.js"));

            bundles.Add(new StyleBundle("~/cssbundles/foundation").Include(
                "~/Content/foundationstyle.css"
            ));

            bundles.Add(new StyleBundle("~/cssbundles/StickMan").Include(
                "~/Content/StickMan/Main.css",
                "~/Content/StickMan/animationfall.css",
                "~/Content/StickMan/animationstand.css",
                "~/Content/StickMan/animationlie.css"
            ));

            #endregion

            #region ChartJS

            bundles.Add(new ScriptBundle("~/bundles/chartjs").Include(
                "~/Scripts/Chart.min.js"));

            #endregion

        }
    }
}

