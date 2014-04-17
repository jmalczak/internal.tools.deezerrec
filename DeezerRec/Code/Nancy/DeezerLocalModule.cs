using Nancy;
using Nancy.ModelBinding;

namespace DeezerRec.Code.Nancy
{
    public class DeezerLocalModule : NancyModule
    {
        public DeezerLocalModule()
        {
            Post["/Start"] = _ =>
            {
                var track = this.Bind<TrackDto>();
                Recorder.Start(track);
                return string.Empty;
            };
            Post["/End"] = _ =>
            {
                Recorder.Stop();
                return string.Empty;
            };
        }
    }
}
