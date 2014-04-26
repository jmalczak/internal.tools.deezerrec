namespace DeezerRec.Lib.Nancy
{
    using DeezerRec.Lib.Annotations;
    using DeezerRec.Lib.Dto;

    using global::Nancy;

    using global::Nancy.ModelBinding;

    [UsedImplicitly]
    public class DeezerLocalModule : NancyModule
    {
        public DeezerLocalModule()
        {
            this.Post["/Start"] = _ =>
            {
                var trackDto = this.Bind<TrackDto>();

                Recorder.Start(trackDto);
                return string.Empty;
            };

            this.Post["/End"] = _ =>
            {
                Recorder.Stop();
                return (object)string.Empty;
            };

            this.Get["/"] = _ => this.View["Web/Views/Player.cshtml"];
        }
    }
}