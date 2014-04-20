using System.Configuration;
using System.Runtime.InteropServices;

namespace DeezerRec.View
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

        public void Navigate()
        {
            WebBrowser.Navigate(ConfigurationManager.AppSettings["ROOT_URL"]);
        }
    }
}
