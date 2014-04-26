namespace DeezerRec.Lib.Dto
{
    using DeezerRec.Lib.Annotations;

    [UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
    public class TrackDto
    {
        public string Album { get; set; }

        public string Artist { get; set; }

        public string Title { get; set; }
    }
}