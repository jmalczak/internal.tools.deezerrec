namespace DeezerRec.Code.Nancy
{
    using System.Reflection;

    using global::Nancy;

    public class DeezerPathProvider : IRootPathProvider
    {
        public string GetRootPath()
        {
            return Assembly.GetExecutingAssembly().Location.Replace(@"\bin\Debug\DeezerRec.exe", "");
        }
    }
}