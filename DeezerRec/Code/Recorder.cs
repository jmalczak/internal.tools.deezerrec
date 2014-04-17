using System.Configuration;
using System.IO;
using System.Threading;
using NAudio.Lame;
using NAudio.Wave;

namespace DeezerRec.Code
{
    public static class Recorder
    {
        private static TrackDto _currentTrack;
        private static WasapiLoopbackCapture _waveIn;
        private static LameMP3FileWriter _lameMp3FileWriter;
        private static AutoResetEvent _recordingStopped;

        public static void Start(TrackDto track)
        {
            _currentTrack = track;
            _waveIn = new WasapiLoopbackCapture();
            _lameMp3FileWriter = new LameMP3FileWriter(GetFileName(), _waveIn.WaveFormat, 256);
            _recordingStopped = new AutoResetEvent(false);

            _waveIn.DataAvailable += LoopbackDataAvailable;
            _waveIn.RecordingStopped += LoopbackRecordingStopped;

            _waveIn.StartRecording();
        }

        public static string GetFileName()
        {
            var downloadFolder = ConfigurationManager.AppSettings["DOWNLOAD_FOLDER"];
            var downloadFolderAlbum = Path.Combine(downloadFolder, _currentTrack.Album);

            if (!Directory.Exists(downloadFolderAlbum))
            {
                Directory.CreateDirectory(downloadFolderAlbum);
            }

            return Path.Combine(downloadFolderAlbum, string.Format("{0} - {1}.mp3", _currentTrack.Album, _currentTrack.Title));
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

            if (_lameMp3FileWriter != null) _lameMp3FileWriter.Dispose();
        }
        private static void LoopbackDataAvailable(object sender, WaveInEventArgs e)
        {
            _lameMp3FileWriter.Write(e.Buffer, 0, e.BytesRecorded);
        }

        private static void LoopbackRecordingStopped(object sender, StoppedEventArgs e)
        {
            _recordingStopped.Set();
        }
    }
}