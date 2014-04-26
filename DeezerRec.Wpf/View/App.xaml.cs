namespace DeezerRec.View
{
    using System;
    using System.Configuration;
    using System.Windows;

    using DeezerRec.Lib;

    using Nancy.Hosting.Self;

    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App
    {
        private readonly NancyHost nancyHost;

        public App()
        {
            this.nancyHost = new NancyHost(new Uri(ConfigurationManager.AppSettings["ROOT_URL"]));
            this.nancyHost.Start();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            this.nancyHost.Dispose();
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
