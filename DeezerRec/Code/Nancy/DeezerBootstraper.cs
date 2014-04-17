using Nancy;
using Nancy.Conventions;

namespace DeezerRec.Code.Nancy
{

    public class DeezerBootstraper : DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);
            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("Web", @"Web"));
        }
    }
}