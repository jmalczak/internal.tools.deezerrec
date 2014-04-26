using System.IO;
using Nancy;
using Nancy.Conventions;

namespace DeezerRec.Lib.Nancy
{
    public class DeezerBootstraper : DefaultNancyBootstrapper
    {
        protected override IRootPathProvider RootPathProvider
        {
            get
            {
                return new DeezerPathProvider();
            }
        }

        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);
            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("Web", Path.Combine(RootPathProvider.GetRootPath(), "Web"), new string[0]));
        }
    }
}