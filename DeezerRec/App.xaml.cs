using System;
using System.Windows;
using Nancy.Hosting.Self;
using NAudio.Wave;

namespace DeezerRec
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public NancyHost NancyHost { get; set; }
        public static WasapiLoopbackCapture WaveIn { get; set; }
        public static WaveFileWriter WaveFileWritter { get; set; }
        public static string FileName { get; set; }

        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            NancyHost = new NancyHost(new Uri("http://localhost:8080/"));
            NancyHost.Start();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            NancyHost.Dispose();
            base.OnExit(e);
        }
    }
}
