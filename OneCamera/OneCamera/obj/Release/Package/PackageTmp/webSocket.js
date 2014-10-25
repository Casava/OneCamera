var ws;
        

$().ready(function () {
    var videoWebSocketDiv = document.getElementById("videoWebSocket");
    //videoWebSocketDiv.setAttribute("width", "500");
    //videoWebSocketDiv.setAttribute("height", "250");

    console.log("websocket connecting");

    ws = new WebSocket("ws://onecamera.azurewebsites.net/OneCamera/OneCameraWebSocketHandler.ashx");
    //ws = new WebSocket("ws://localhost:50330/OneCamera/OneCameraWebSocketHandler.ashx");

    ws.onopen = function () {
        console.log("connected");
    };

    ws.onmessage = function (evt) {
        //http://www.html5rocks.com/en/tutorials/getusermedia/intro/
        //http://stackoverflow.com/questions/22996665/unable-to-get-mediasource-working-with-mp4-format-in-chrome
        //http://stackoverflow.com/questions/22157623/h264-video-works-using-src-attribute-same-video-fails-using-the-mediasource-api
        //http://html5-demos.appspot.com/static/media-source.html
        //console.log(evt.data);

        var elem = document.createElement("img");
        try {
            videoWebSocketDiv.removeChild(videoWebSocketDiv.firstChild);
            elem.setAttribute("src", evt.data);
            elem.setAttribute("width", "500");
            elem.setAttribute("height", "250");
            //elem.setAttribute("alt", "Flower");
            videoWebSocketDiv.appendChild(elem);
        }
        catch(err)
        {
            console.log(err);
            console.log('length ');
            console.log(evt.data.toString().length);
        }
    };

    ws.onerror = function (evt) {
        console.assert(evt.message);
    };
    ws.onclose = function () {
        console.assert("disconnected");
    };
});