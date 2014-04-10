using Nancy;
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
                
                App.FileName = string.Format(@"C:\{0} - {1}.wav", _.band, _.title);
                App.WaveFileWritter = new WaveFileWriter(App.FileName, App.WaveIn.WaveFormat);

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
            App.WaveFileWritter.Dispose();
        }
    }
}
