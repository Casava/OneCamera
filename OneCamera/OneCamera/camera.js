
//http://www.html5rocks.com/en/tutorials/getusermedia/intro/

//http://www.html5rocks.com/en/tutorials/webrtc/basics/

    function hasGetUserMedia() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    var vgaConstraints = {
        video: {
            mandatory: {
                maxWidth: 640,
                maxHeight: 360
            }
        },
        video: true,
        audio: false
    };

    var errorCallback = function (e) {
        console.log('Reeeejected!', e);
    };

    function startCamera() {
        navigator.getUserMedia = navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia;

        // Not showing vendor prefixes.
        navigator.getUserMedia(vgaConstraints, function (localMediaStream) {
            var video = document.getElementById('videoCamera');
            video.src = window.URL.createObjectURL(localMediaStream);

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function (e) {
                // Ready to go. Do some stuff.
            };
        }, errorCallback);
    }

    $('#btnCamera').click(function () {
        if(hasGetUserMedia())
        {
            startCamera();
        }
    });
