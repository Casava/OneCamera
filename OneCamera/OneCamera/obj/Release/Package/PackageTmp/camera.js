
//http://www.html5rocks.com/en/tutorials/getusermedia/intro/

//http://www.html5rocks.com/en/tutorials/webrtc/basics/

//https://github.com/burtlo/videojs/blob/master/views/index.erb


var rafId;
var cameraVideo;
var localCameraMediaStream;

$().ready(function () {
    var cameraRecordCanvas = document.createElement('canvas');
    cameraRecordCanvas.width = 600;
    cameraRecordCanvas.height = 300;

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var imageArray = [];
    var imageIndex = 0;

    function drawVideoFrame(time) {
        rafId = window.requestAnimationFrame(drawVideoFrame);
        var ctx = cameraRecordCanvas.getContext('2d');
        //ctx.scale(0.8, 0.8);
        ctx.drawImage(cameraVideo, 0, 0, 600, 300);
        var imageDataUrl = cameraRecordCanvas.toDataURL("image/webp");
        //var imageData = ctx.getImageData(0, 0, 600, 300);
        //console.log(imageDataUrl.length);
        console.log(imageDataUrl);
        ws.send(imageDataUrl.toString());
        
        var videoImg = document.getElementById("videoImg");
        videoImg.setAttribute("src", imageDataUrl.toString());
        videoImg.setAttribute("width", "600");
        videoImg.setAttribute("height", "300");
    };


    function dataUritoView(dataUri) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataUri.split(',')[1]);
        //console.log('byteString ' + byteString.length);
        var ab = new ArrayBuffer(byteString.length);
        $("#spanStatus").text(lengthInUtf8Bytes(dataUri));
        return byteString;
        var view = new DataView(ab);
        for (var i = 0; i < byteString.length; i++) {
            view.setUint8(i, byteString.charCodeAt(i), true);
        }
        //return view;
    }

    function lengthInUtf8Bytes(str) {
        // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
        var m = encodeURIComponent(str).match(/%[89ABab]/g);
        return str.length + (m ? m.length : 0);
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
                        maxWidth: 600, 
                        maxHeight: 300
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

    $('#captureCamera').click(function () {
  
        window.requestAnimationFrame(function(time){
            var ctx = cameraRecordCanvas.getContext('2d');
            //ctx.scale(0.8, 0.8);
            ctx.drawImage(cameraVideo, 0, 0, 600, 300);
            var imageDataUrl = cameraRecordCanvas.toDataURL("image/webp");
            //var imageData = ctx.getImageData(0, 0, 600, 300);
            //console.log(imageDataUrl.length);
            console.log(imageDataUrl);
            ws.send(imageDataUrl.toString());

            var videoImg = document.getElementById("videoImg");
            videoImg.setAttribute("src", imageDataUrl.toString());
            videoImg.setAttribute("width", "600");
            videoImg.setAttribute("height", "300");
        });
    });

});

