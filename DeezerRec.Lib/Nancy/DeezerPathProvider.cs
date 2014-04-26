using System;
using System.Configuration;
using System.Reflection;
using System.Web.Hosting;
using Nancy;

namespace DeezerRec.Lib.Nancy
{
    public class DeezerPathProvider : IRootPathProvider
    {
        public string GetRootPath()
        {
            switch (ConfigurationManager.AppSettings["HOST_TYPE"])
            {
                case "WPF_DEBUG": return Assembly.GetExecutingAssembly().Location.Replace("\\bin\\Debug\\DeezerRec.Lib.dll", string.Empty);
                case "WPF": return Assembly.GetExecutingAssembly().Location.Replace("\\DeezerRec.Lib.dll", string.Empty);
                case "ASP.NET":
                {
                    var rootPath = HostingEnvironment.MapPath("~");

                    if (rootPath != null)
                    {
                        return rootPath.Replace("\\DeezerRec.Web", string.Empty) + "DeezerRec.Wpf";
                    }

                    return null;
                }
                default: throw new Exception("Invlide HOST_TYPE");
            }
        }
    }
}