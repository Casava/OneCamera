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
            bool read = true;
            long lastKey = 0;
            while (true)
            {  
                if (socket.State == WebSocketState.Open)
                {
                    if (read)
                    {
                        var buffer = new ArraySegment<byte>(new byte[100000]);
                        WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                        string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
                        if (userMessage.StartsWith("Send Require"))
                            read = false;
                        else
                            OneCameraBuffer.Instance.AddNewFrame(buffer);
                    }
                    else
                    {
                        ArraySegment<byte> buffer;
                        long recentKey = OneCameraBuffer.Instance.GetFrame(lastKey, out buffer);
                        if (recentKey != 0 && recentKey > lastKey && buffer != null)
                        {
                            lastKey = recentKey;
                            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                    }
                }
            }

            //var webSocketTasks = new List<Task>();
            //webSocketTasks.Add(Task.Factory.StartNew(new Action<object>(async ws => {
            //    var sendWs = ws as WebSocket;
            //    long lastKey = 0;
            //    while(sendWs.State == WebSocketState.Open)
            //    {
            //        ArraySegment<byte> buffer;
            //        lastKey = OneCameraBuffer.Instance.GetFrame(lastKey, out buffer);
            //        if (lastKey != 0)
            //            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            //    }
            //}), socket));
            //webSocketTasks[0].Start();
            //webSocketTasks.Add(Task.Factory.StartNew(new Action<object>(async ws =>
            //{
            //    var receiveWs = ws as WebSocket;
            //    while (receiveWs.State == WebSocketState.Open)
            //    {
            //        var buffer = new ArraySegment<byte>(new byte[50960]);
            //        WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
            //        OneCameraBuffer.Instance.AddNewFrame(buffer);
            //    }
            //}), socket));
            //webSocketTasks[1].Start();
            //Task.WaitAll(webSocketTasks.ToArray());
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