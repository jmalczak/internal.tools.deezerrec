using System.Configuration;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading;
using DeezerRec.Lib.Dto;
using NAudio.Lame;
using NAudio.Wave;

namespace DeezerRec.Lib
{
    public static class Recorder
    {
        private static readonly object _lock = new object();
        private static TrackDto _currentTrack;
        private static WasapiLoopbackCapture _waveIn;
        private static LameMP3FileWriter _lameMp3FileWriter;
        private static ManualResetEvent _recordingStopped;

        static Recorder()
        {
        }

        public static void Start(TrackDto track)
        {
            lock (_lock)
            {
                _currentTrack = track;
                _waveIn = new WasapiLoopbackCapture();
                _lameMp3FileWriter = new LameMP3FileWriter(GetFileName(), _waveIn.WaveFormat, 256);
                _recordingStopped = new ManualResetEvent(false);
                _waveIn.DataAvailable += LoopbackDataAvailable;
                _waveIn.RecordingStopped += LoopbackRecordingStopped;
                _waveIn.StartRecording();
            }
        }

        public static void Stop()
        {
            if (_waveIn != null)
            {
                _waveIn.StopRecording();
                _recordingStopped.WaitOne();
                _waveIn.DataAvailable -= LoopbackDataAvailable;
                _waveIn.RecordingStopped -= LoopbackRecordingStopped;
                _waveIn.Dispose();
            }
            
            if (_lameMp3FileWriter == null) return;
            
            _lameMp3FileWriter.Dispose();
        }

        private static void LoopbackDataAvailable(object sender, WaveInEventArgs e)
        {
            _lameMp3FileWriter.Write(e.Buffer, 0, e.BytesRecorded);
        }

        private static void LoopbackRecordingStopped(object sender, StoppedEventArgs e)
        {
            _recordingStopped.Set();
        }

        private static string GetFileName()
        {
            string str = Path.Combine(ConfigurationManager.AppSettings["DOWNLOAD_FOLDER"], MakeValidFileName(_currentTrack.Album));
            if (!Directory.Exists(str)) Directory.CreateDirectory(str);
            int num = 0;
            string path = Path.Combine(str, MakeValidFileName(string.Format("{0} - {1}.mp3", _currentTrack.Album, _currentTrack.Title)));
            while (File.Exists(path))
            {
                path = Path.Combine(str, MakeValidFileName(string.Format("{0} - {1}_{2}.mp3", _currentTrack.Album, _currentTrack.Title, num)));
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