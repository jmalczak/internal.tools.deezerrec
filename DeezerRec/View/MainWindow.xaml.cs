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
            WebBrowser.Navigate("http://localhost:8080/Web/Views/Player.html");
        }
    }
}
