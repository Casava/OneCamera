using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Threading.Tasks;
using System.Web.WebSockets;
using System.Net.WebSockets;
using System.Threading;

namespace OneCamera
{
    /// <summary>
    /// Description résumée de OneCameraWebSocketHandler
    /// </summary>
    public class OneCameraWebSocketHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            VideoData.Instance.GetVideoLength();
            if (context.IsWebSocketRequest || context.IsWebSocketRequestUpgrading)
            {
                context.AcceptWebSocketRequest(ProcessRequest);
            }
        }

        private async Task ProcessRequest(AspNetWebSocketContext context)
        {
            WebSocket socket = context.WebSocket;
            while (true)
            {
                var buffer = new ArraySegment<byte>(new byte[1024]);
                WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                if (socket.State == WebSocketState.Open)
                {
                    var videoLength = VideoData.Instance.GetVideoLength();

                    //string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
                    //userMessage = string.Format("From OneCamera, You sent: {0} at {1}; Video size : {2} Bytes",
                    //    userMessage, DateTime.Now.ToLongTimeString(), videoLength);
                    //buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(userMessage));
                    //await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);

                    for (int i = 0; i < videoLength; i += 5012)
                    {
                        var bytes = VideoData.Instance.GetVideoBytes(i, 5012);
                        VideoData.Instance.GetVideoBytes(i, (int) videoLength - i);
                        var videoBuffer = new ArraySegment<byte>(bytes);
                        await socket.SendAsync(videoBuffer, WebSocketMessageType.Binary, true, CancellationToken.None);
                    }
                }
                else
                {
                    break;
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}