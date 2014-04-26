namespace DeezerRec.Lib
{
    using System.Configuration;
    using System.IO;
    using System.Text.RegularExpressions;
    using System.Threading;

    using DeezerRec.Lib.Dto;

    using NAudio.Lame;
    using NAudio.Wave;

    public static class Recorder
    {
        private static readonly object Lock = new object();
        private static TrackDto currentTrack;
        private static WasapiLoopbackCapture waveIn;
        private static LameMP3FileWriter lameMp3FileWriter;
        private static ManualResetEvent recordingStopped;

        public static void Start(TrackDto track)
        {
            lock (Lock)
            {
                currentTrack = track;
                waveIn = new WasapiLoopbackCapture();
                lameMp3FileWriter = new LameMP3FileWriter(GetFileName(), waveIn.WaveFormat, 256);
                recordingStopped = new ManualResetEvent(false);
                waveIn.DataAvailable += LoopbackDataAvailable;
                waveIn.RecordingStopped += LoopbackRecordingStopped;
                waveIn.StartRecording();
            }
        }

        public static void Stop()
        {
            if (waveIn != null)
            {
                waveIn.StopRecording();
                recordingStopped.WaitOne();
                waveIn.DataAvailable -= LoopbackDataAvailable;
                waveIn.RecordingStopped -= LoopbackRecordingStopped;
                waveIn.Dispose();
            }

            if (lameMp3FileWriter == null)
            {
                return;
            }

            lameMp3FileWriter.Dispose();
        }

        private static void LoopbackDataAvailable(object sender, WaveInEventArgs e)
        {
            lameMp3FileWriter.Write(e.Buffer, 0, e.BytesRecorded);
        }

        private static void LoopbackRecordingStopped(object sender, StoppedEventArgs e)
        {
            recordingStopped.Set();
        }

        private static string GetFileName()
        {
            string str = Path.Combine(ConfigurationManager.AppSettings["DOWNLOAD_FOLDER"], MakeValidFileName(currentTrack.Album));
            
            if (!Directory.Exists(str))
            {
                Directory.CreateDirectory(str);
            }

            int num = 0;
            string path = Path.Combine(str, MakeValidFileName(string.Format("{0} - {1}.mp3", currentTrack.Album, currentTrack.Title)));
            while (File.Exists(path))
            {
                path = Path.Combine(str, MakeValidFileName(string.Format("{0} - {1}_{2}.mp3", currentTrack.Album, currentTrack.Title, num)));
                ++num;
            }

            return path;
        }

        private static string MakeValidFileName(string name)
        {
            string pattern = string.Format("([{0}]*\\.+$)|([{0}]+)", Regex.Escape(new string(Path.GetInvalidFileNameChars())));
            return Regex.Replace(name, pattern, "_");
        }
    }
}