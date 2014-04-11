using Nancy;
using Nancy.Conventions;

namespace DeezerRec
{

    public class DeezerBootstraper : DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);
            conventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("Scripts", @"scripts"));
        }
    }
}