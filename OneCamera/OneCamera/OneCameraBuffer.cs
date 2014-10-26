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

        private Dictionary<long, ArraySegment<byte>> _videoFrames = new Dictionary<long, ArraySegment<byte>>();
        private readonly static object _syncRoot = new object();

        private static volatile bool _adding = true;


        public void AddNewFrame(ArraySegment<byte> frame)
        {
            if(_adding)
            {
                    long key = 0;
                    if (_videoFrames.Count > 0)
                    {
                        key = _videoFrames.Max(p => p.Key) + 1;
                    }
                    _videoFrames.Add(key, frame);
                    if (_videoFrames.Count > 5)
                    {
                        long lastKey = _videoFrames.OrderBy(p => p.Key).First().Key;
                        _videoFrames.Remove(lastKey);
                    }
                
                _adding = false;
            }
        }

        public long GetFrame(long recentKey, out ArraySegment<byte> newBuffer)
        {
            long key = 0;
            if (!_adding)
            {

                if (_videoFrames.Count > 0 && _videoFrames.Any(p => p.Key > recentKey))
                {
                    newBuffer = _videoFrames.Where(p => p.Key > recentKey).OrderBy(p => p.Key).First().Value;
                    key = _videoFrames.Where(p => p.Key > recentKey).First().Key;
                }
                _adding = true;
            }
            
            return key;
        }
    }
}