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
                    string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
                    userMessage = "From OneCamera, You sent: " + userMessage + " at " + DateTime.Now.ToLongTimeString();
                    buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(userMessage));
                    await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
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