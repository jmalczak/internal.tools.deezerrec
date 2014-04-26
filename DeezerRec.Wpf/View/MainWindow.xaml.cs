namespace DeezerRec.View
{
    using System.Configuration;
    using System.Runtime.InteropServices;

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

        public void Navigate()
        {
            WebBrowser.Navigate(ConfigurationManager.AppSettings["ROOT_URL"]);
        }
    }
}
