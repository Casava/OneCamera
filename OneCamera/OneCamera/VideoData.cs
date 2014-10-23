using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web;

namespace OneCamera
{
    public class VideoData
    {
        private static readonly Lazy<VideoData> _instance = new Lazy<VideoData>(() => new VideoData(), LazyThreadSafetyMode.ExecutionAndPublication);
        public static VideoData Instance
        {
            get { return _instance.Value; }
        }

        private byte[] _videoBytes;

        private VideoData()
        {
            _videoBytes = File.ReadAllBytes(System.Web.HttpContext.Current.Server.MapPath("~/Assets/WP_20140928_004.mp4"));
        }

        public long GetVideoLength()
        {
            return _videoBytes == null
                ? 0
                : _videoBytes.Length;
        }

        public byte[] GetVideoBytes(int offset, int length)
        {
            if (_videoBytes.Length > offset + length)
            {
                var destinationBytes = new byte[length];
                Array.Copy(_videoBytes, offset, destinationBytes, 0, length);
                return destinationBytes;
            }
            else
            {
                var destinationBytes = new byte[_videoBytes.Length - offset];
                Array.Copy(_videoBytes, offset, destinationBytes, 0, _videoBytes.Length - offset);
                return destinationBytes;
            }
        }
    }
}