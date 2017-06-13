using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Partsunlimited.UITests
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using OpenQA.Selenium;
    using OpenQA.Selenium.Chrome;
    using OpenQA.Selenium.Firefox;
    using OpenQA.Selenium.IE;
    using OpenQA.Selenium.Remote;
    using OpenQA.Selenium.PhantomJS;
    using System;
    using System.Threading;

    [TestClass]
    public class UITestsClass
    {
        private string baseURL = "http://attiotstarterkitdev.azurewebsites.net/Dashboard/FallDetection";
        private string baseApiUrl = "http://attiotstarterkitdev.azurewebsites.net/data/89011704252322282465?top=25";
        private string deviceID = "89011704252322282465";
        private RemoteWebDriver driver;
        public TestContext TestContext { get; set; }

        [TestMethod]
        [TestCategory("Selenium")]
        [Priority(1)]

        public void LoadATTIotStarterKit_API_Chrome()
        {

            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(60));

            driver.Navigate().GoToUrl(this.baseApiUrl);
            Thread.Sleep(1000);
           
        }

        [TestMethod]
        [TestCategory("Selenium")]
        [Priority(3)]
        public void LoadATTIotStarterKit_FallDashboard_Chrome()
        {

            driver = new ChromeDriver();
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(60));
            driver.Navigate().GoToUrl(this.baseURL);
            driver.ExecuteScript("window.localStorage.setItem('ATTIoTStarterKitDeviceId','"+this.deviceID + "');");
            driver.Navigate().Refresh();
            Thread.Sleep(5000);
         
            //driver.FindElementById("search - box").Clear();
            //driver.FindElementById("search - box").SendKeys("tire");
        }

        
        public void LoadATTIotStarterKit_FallDashboard_IE()
        {

            driver = new InternetExplorerDriver();
            driver.Manage().Window.Maximize();
            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(60));
            driver.Navigate().GoToUrl(this.baseURL);
            driver.ExecuteScript("window.localStorage.setItem('ATTIoTStarterKitDeviceId','"+ this.deviceID +"');");
            driver.Navigate().Refresh();
            Thread.Sleep(5000);
        }

        [TestCleanup()]
        public void MyTestCleanup()
        {
            driver.Quit();
        }

        [TestInitialize()]
        public void MyTestInitialize()
        {
        }
    }
}

