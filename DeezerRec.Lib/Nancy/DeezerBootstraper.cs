namespace DeezerRec.Lib.Nancy
{
    using System.IO;

    using DeezerRec.Lib.Annotations;

    using global::Nancy;

    using global::Nancy.Conventions;

    [UsedImplicitly]
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
            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("Web", Path.Combine(this.RootPathProvider.GetRootPath(), "Web"), new string[0]));
        }
    }
}