using System;
using System.Windows;
using DeezerRec.Code;
using DeezerRec.Code.WebBrowser;
using Nancy.Hosting.Self;
using NAudio.Lame;
using NAudio.Wave;

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
            _nancyHost = new NancyHost(new Uri("http://localhost:8080/"));
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
