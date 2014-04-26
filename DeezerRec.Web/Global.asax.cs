namespace DeezerRec.Web
{
    using System;
    using System.Globalization;
    using System.IO;
    using System.Linq;

    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            // find path to 'bin' folder
            var binPath = Path.Combine(new[] { AppDomain.CurrentDomain.BaseDirectory, "bin" });

            // get current search path from environment
            var path = Environment.GetEnvironmentVariable("PATH") ?? string.Empty;

            // add 'bin' folder to search path if not already present
            if (!path.Split(Path.PathSeparator).Contains(binPath, StringComparer.CurrentCultureIgnoreCase))
            {
                path = string.Join(Path.PathSeparator.ToString(CultureInfo.InvariantCulture), new[] { path, binPath });
                Environment.SetEnvironmentVariable("PATH", path);
            }
        }
    }
}