
//http://www.html5rocks.com/en/tutorials/getusermedia/intro/

//http://www.html5rocks.com/en/tutorials/webrtc/basics/

//https://github.com/burtlo/videojs/blob/master/views/index.erb

var rafId;

var recordingFrames = [];

var cameraRecordCanvas = document.createElement('canvas');
cameraRecordCanvas.width = 640;
cameraRecordCanvas.height = 360;
var ctx = cameraRecordCanvas.getContext('2d');

var cameraVideo = document.getElementById('videoCamera');;

var localCameraMediaStream;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function drawVideoFrame(time) {
    rafId = window.requestAnimationFrame(drawVideoFrame);
    ctx.drawImage(video, 0, 0, cameraRecordCanvas.width, cameraRecordCanvas.height);
    //frames.push(cameraRecordCanvas.toDataURL('image/webp', 1));
    var image = cameraRecordCanvas.toDataURL("image/webp", 1);
    //ws.send(dataUritoView(image));
    console.log(dataUritoView(image));
};


function dataUritoView(dataUri) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataUri.split(',')[1]);

    var ab = new ArrayBuffer(byteString.length);
    var view = new DataView(ab);
    for (var i = 0; i < byteString.length; i++) {
        view.setUint8(i, byteString.charCodeAt(i), true);
    }
    return view;
}

cameraVideo.addEventListener('loadeddata', function () {

    rafId = window.requestAnimationFrame(drawVideoFrame);
    ctx.drawImage(video, 0, 0, cameraRecordCanvas.width, cameraRecordCanvas.height);
    console.log("Saving Frame");
    //frames.push(cameraRecordCanvas.toDataURL('image/webp', 1));
    var image = cameraRecordCanvas.toDataURL("image/webp", 1);
    //ws.send(dataUritoView(image));
    console.log(dataUritoView(image));
});

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
                    maxWidth: 640,
                    maxHeight: 360
                }
            },
            audio: false
        }, 
        function (localMediaStream) {
            cameraVideo.src = window.URL.createObjectURL(localMediaStream);
            localCameraMediaStream = localMediaStream;
        }, 
        function (e) {
            console.log('Reeeejected!', e);
        }
    );
}

function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

$('#btnCamera').click(function () {
    if(hasGetUserMedia())
    {
        startCamera();
    }
});


