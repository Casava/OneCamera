using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Concurrent;

namespace OneCamera
{
    public class OneCameraBuffer
    {
        private static readonly Lazy<OneCameraBuffer> lazy = new Lazy<OneCameraBuffer>(() => new OneCameraBuffer(), System.Threading.LazyThreadSafetyMode.ExecutionAndPublication);
        public static OneCameraBuffer Instance { get { return lazy.Value; } }

        private volatile string _videoFrames = null;
        private readonly static object _syncRoot = new object();


        public void AddNewFrame(string frame)
        {
            _videoFrames = frame;
        }

        public string GetFrame()
        {
            return _videoFrames;
        }
    }
}