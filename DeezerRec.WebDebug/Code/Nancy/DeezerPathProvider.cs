namespace DeezerRec.WebDebug.Code.Nancy
{
    using System.Web.Hosting;

    using global::Nancy;

    public class DeezerPathProvider : IRootPathProvider
    {
        public string GetRootPath()
        {
            return HostingEnvironment.MapPath("~/").Replace(@"\DeezerRec.WebDebug", string.Empty);
        }
    }
}