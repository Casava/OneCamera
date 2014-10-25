var ws;
        

$().ready(function () {


    console.log("websocket connecting");

    //ws = new WebSocket("ws://onecamera.azurewebsites.net/OneCamera/OneCameraWebSocketHandler.ashx");
    ws = new WebSocket("ws://localhost:50330/OneCamera/OneCameraWebSocketHandler.ashx");

    ws.onopen = function () {
        console.log("connected");
    };

    ws.onmessage = function (evt) {
        //http://www.html5rocks.com/en/tutorials/getusermedia/intro/
        //http://stackoverflow.com/questions/22996665/unable-to-get-mediasource-working-with-mp4-format-in-chrome
        //http://stackoverflow.com/questions/22157623/h264-video-works-using-src-attribute-same-video-fails-using-the-mediasource-api
        //http://html5-demos.appspot.com/static/media-source.html

        var videoImg = document.getElementById("videoImg");
        videoImg.setAttribute("src", evt.data);
        videoImg.setAttribute("width", "500");
        videoImg.setAttribute("height", "250");
    };

    ws.onerror = function (evt) {
        console.assert(evt.message);
    };
    ws.onclose = function () {
        console.assert("disconnected");
    };
});