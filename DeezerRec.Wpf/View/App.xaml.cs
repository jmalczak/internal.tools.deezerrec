using System;
using System.Configuration;
using System.Windows;
using DeezerRec.Lib.Code;
using DeezerRec.Lib.Code.WebBrowser;
using Nancy.Hosting.Self;

namespace DeezerRec.View
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App
    {
        private readonly NancyHost _nancyHost;

        public App()
        {
            _nancyHost = new NancyHost (new Uri(ConfigurationManager.AppSettings["ROOT_URL"]));
            _nancyHost.Start();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            _nancyHost.Dispose();
            Recorder.Stop();

            base.OnExit(e);
        }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Clear cache to make web browser component usable :)
            WebBrowserClearCache.Clear();
            
            MainWindow mainWindow = new MainWindow();

            mainWindow.Navigate();
            mainWindow.Show();
        }
    }
}
