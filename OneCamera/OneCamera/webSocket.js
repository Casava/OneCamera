var ws;
        

$().ready(function () {


    console.log("websocket connecting");

    //ws = new WebSocket("ws://onecamera.azurewebsites.net/OneCamera/OneCameraWebSocketHandler.ashx");
    ws = new WebSocket("ws://localhost:50330/OneCamera/OneCameraWebSocketHandler.ashx");

    ws.onopen = function () {
        console.log("connected");
    };

    ws.onmessage = function (evt) {;
    };

    ws.onerror = function (evt) {
        console.assert(evt.message);
    };
    ws.onclose = function () {
        console.assert("disconnected");
    };
});