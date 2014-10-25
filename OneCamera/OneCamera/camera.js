
//http://www.html5rocks.com/en/tutorials/getusermedia/intro/

//http://www.html5rocks.com/en/tutorials/webrtc/basics/

//https://github.com/burtlo/videojs/blob/master/views/index.erb

var rafId;
var cameraVideo;
var localCameraMediaStream;

$().ready(function () {
    var cameraRecordCanvas = document.createElement('canvas');
    cameraRecordCanvas.width = 500;
    cameraRecordCanvas.height = 250;
    var ctx = cameraRecordCanvas.getContext('2d');


    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    //var videoWebSocketDiv = document.getElementById("videoWebSocket");

    function drawVideoFrame(time) {
        rafId = window.requestAnimationFrame(drawVideoFrame);
        ctx.drawImage(cameraVideo, 0, 0, 500, 250, 0, 0, 500, 250);
        var image = cameraRecordCanvas.toDataURL("image/webp", 0.5);
        //console.log(image);


        //videoWebSocketDiv.removeChild(videoWebSocketDiv.firstChild);
        //var elem = document.createElement("img");
        //elem.setAttribute("src", image);
        //elem.setAttribute("height", "250");
        //elem.setAttribute("width", "500");
        //videoWebSocketDiv.appendChild(elem);

        //ws.send(image);
        //dataUritoView(image);
        ws.send(dataUritoView(image));
    };


    function dataUritoView(dataUri) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        //console.log('dataUri ' + dataUri.length);
        var byteString = atob(dataUri.split(',')[1]);
        //console.log('byteString ' + byteString.length);
        var ab = new ArrayBuffer(byteString.length);
        var view = new DataView(ab);
        for (var i = 0; i < byteString.length; i++) {
            view.setUint8(i, byteString.charCodeAt(i), true);
        }
        //console.log('view ' + view.length);
        return view;
    }



    function startCamera() {
        navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;

        // Not showing vendor prefixes.
        navigator.getUserMedia(
            {
                video: {
                    mandatory: {
                        maxWidth: 500,
                        maxHeight: 250
                    }
                },
                audio: false
            },
            function (localMediaStream) {
                cameraVideo = document.getElementById('videoCamera');
                cameraVideo.src = window.URL.createObjectURL(localMediaStream);
                localCameraMediaStream = localMediaStream;
                cameraVideo.addEventListener('loadeddata', function () {
                    rafId = window.requestAnimationFrame(drawVideoFrame);
                });
            },
            function (e) {
                console.log('Reeeejected!', e);
            }
        );
    };

    function hasGetUserMedia() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    $('#btnCamera').click(function () {
        console.log("Clicked");
        if (hasGetUserMedia()) {
            console.log("has Get User Media");
            startCamera();
        }
    });

});

