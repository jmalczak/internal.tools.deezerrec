using System;
using System.Windows;
using Nancy.Hosting.Self;
using NAudio.Lame;
using NAudio.Wave;

namespace DeezerRec
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App
    {
        private static readonly object _lock = new object();
        private readonly NancyHost _nancyHost;

        private static WasapiLoopbackCapture _waveIn;
        public static WasapiLoopbackCapture WaveIn
        {
            get
            {
                lock (_lock) return _waveIn;
            }
            set
            {
                lock (_lock) _waveIn = value;
            }
        }

        private static WaveFileWriter _waveFileWriter;

        public static WaveFileWriter WaveFileWritter
        {
            get 
            {
                lock (_lock) return _waveFileWriter;
            }
            set
            {
                lock (_lock) _waveFileWriter = value;
            }
        }

        private static LameMP3FileWriter _lameMp3FileWriter;

        public static LameMP3FileWriter LameMp3FileWriter
        {
            get
            {
                lock(_lock) return _lameMp3FileWriter;
            }
            set
            {
                lock(_lock) _lameMp3FileWriter = value;
            }
        }

        public static string FileName { get; set; }

        public App()
        {
            _nancyHost = new NancyHost(new Uri("http://localhost:8080/"));
            _nancyHost.Start();
        }

        protected override void OnExit(ExitEventArgs e)
        {
            _nancyHost.Dispose();
            base.OnExit(e);
        }
    }
}
