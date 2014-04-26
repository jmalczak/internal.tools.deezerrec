using DeezerRec.Lib.Dto;
using Nancy;
using Nancy.ModelBinding;

namespace DeezerRec.Lib.Nancy
{
    public class DeezerLocalModule : NancyModule
    {
        public DeezerLocalModule()
        {
            Post["/Start"] = _ =>
            {
                var trackDto = this.Bind<TrackDto>();

                Recorder.Start(trackDto);
                return string.Empty;
            };

            Post["/End"] = _ =>
            {
                Recorder.Stop();
                return (object)string.Empty;
            };

            Get["/"] = _ => View["Web/Views/Player.cshtml"];
        }
    }
}