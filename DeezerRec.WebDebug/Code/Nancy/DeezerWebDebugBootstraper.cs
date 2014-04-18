namespace DeezerRec.WebDebug.Code.Nancy
{
    using System.IO;

    using global::Nancy;
    using global::Nancy.Conventions;

    public class DeezerWebDebugBootstraper : DefaultNancyBootstrapper
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
            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("Web", Path.Combine(RootPathProvider.GetRootPath(), @"DeezerRec\Web")));
        }

    }
}