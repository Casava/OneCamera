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
            string lastImageUnFinishedString = null;
            while (true)
            {
                if (socket.State == WebSocketState.Open)
                {
                    if (read)
                    {
                        var buffer = new ArraySegment<byte>(new byte[102400]);
                        WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                        string receivedData = Encoding.UTF8.GetString(buffer.Array);
                        int goodLength = receivedData.IndexOf("\0");
                        receivedData = receivedData.Substring(0, goodLength);
                        if (receivedData.StartsWith("Send Require"))
                            read = false;
                        else if (receivedData.StartsWith("data:image/webp;base64,"))
                        {
                            OneCameraBuffer.Instance.AddNewFrame(lastImageUnFinishedString);
                            lastImageUnFinishedString = receivedData;
                        }
                        else
                        {
                            lastImageUnFinishedString += receivedData;
                        }
                    }
                    else
                    {
                        string receivedData = OneCameraBuffer.Instance.GetFrame();
                        if (receivedData != null && receivedData.Length > 100)
                        {
                            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(receivedData));
                            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                        }
                    }
                }
            }
        }

        static byte[] GetBytes(string str)
        {
            byte[] bytes = new byte[str.Length * sizeof(char)];
            System.Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
            return bytes;
        }

        static string GetString(byte[] bytes)
        {
            char[] chars = new char[bytes.Length / sizeof(char)];
            System.Buffer.BlockCopy(bytes, 0, chars, 0, bytes.Length);
            return new string(chars);
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