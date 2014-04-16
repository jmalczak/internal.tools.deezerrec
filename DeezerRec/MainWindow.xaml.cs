using System.Runtime.InteropServices;
using System.Windows;
using NAudio.Wave;

namespace DeezerRec
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    [ComVisible(true)]
    public partial class MainWindow
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Start_OnClick(object sender, RoutedEventArgs e)
        {
            App.WaveIn = new WasapiLoopbackCapture();
            App.WaveIn.DataAvailable += WaveIn_DataAvailable;            
            WebBrowserClearCache.Clear();
            WebBrowser.Navigate("http://localhost:8080/");
        }

        private void End_OnClick(object sender, RoutedEventArgs e)
        {
        }

        void WaveIn_DataAvailable(object sender, WaveInEventArgs e)
        {
            App.LameMp3FileWriter.Write(e.Buffer, 0, e.BytesRecorded);
        }
    }
}
