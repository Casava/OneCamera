$(function(){

	var ws = new WebSocket("ws://localhost:8080/send", 'echo-portocol');

	// var cameraRecordCanvas = $('#videocanvas');
	var cameraRecordCanvas = document.createElement('canvas');
	cameraRecordCanvas.width = 500;
	cameraRecordCanvas.height = 250;

	window.requestAnimationFrame = window.requestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.msRequestAnimationFrame;

	function drawVideoFrame(time){
		rafId = window.requestAnimationFrame(drawVideoFrame);

		var ctx = cameraRecordCanvas.getContext('2d');
		ctx.drawImage(cameraVideo, 0, 0, 500, 250);
		var image = cameraRecordCanvas.toDataURL("image/webp", 0.5);
		ws.send(image);
	}	
	

	function startCamera(){
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


	}

	function hasGetUserMedia(){
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia
			|| navigator.mozGetUserMedia || navigator.msGetUserMedia);

	}

	$('#start').on('click', function(){
		if(hasGetUserMedia()){
			console.log('Has user media');
			startCamera();
		}
	});

});
