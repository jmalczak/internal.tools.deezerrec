using Nancy;
using NAudio.Lame;
using NAudio.Wave;

namespace DeezerRec
{
    public class DeezerLocalModule : NancyModule
    {
        public DeezerLocalModule()
        {
            Get["/"] = param => View["Player.html"];
            Get["/Include"] = param => View["Include.html"];
            Get["/Start/{band}/{title}"] = _ =>
            {
                bool firstRun = App.WaveFileWritter == null;

                if (!firstRun)
                {
                    App.WaveFileWritter.Dispose();
                }
                
                App.FileName = string.Format(@"C:\{0} - {1}.mp3", _.band, _.title);
                App.LameMp3FileWriter = new LameMP3FileWriter(App.FileName, App.WaveIn.WaveFormat, LAMEPreset.ABR_128);
                App.WaveIn.StartRecording();

                return string.Empty;
            };
            Get["/End"] = _ =>
            {
                App.WaveIn.StopRecording();
                App.WaveIn.RecordingStopped += WaveIn_RecordingStopped;

                return string.Empty;
            };
        }
        
        void WaveIn_RecordingStopped(object sender, StoppedEventArgs e)
        {
            App.LameMp3FileWriter.Dispose();
        }
    }
}
