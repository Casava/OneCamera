$(function(){

	var socket;

	var recevier = $("#recevier");
	// recevier.attr("src", evt.data);
	recevier.css("width", 500);
	recevier.css("height", 250);
	recevier.css("background-color", "#000000");

	$('#start').on('click', function(){
		console.log("started");
		// socket = new WebSocket("ws://onecamera.azurewebsites.net/OneCamera/OneCameraWebSocketHandler.ashx");
		socket = new WebSocket("ws://localhost:8080/receive", 'echo-portocol');

		socket.onopen = function(){
			console.log("connected");
		}

		socket.onmessage = function(){
			
		}

		socket.onerror = function(env){
			console.log(env.message);
		}

		socket.onclose = function(){
			console.log("disconnected");
		}

		console.log("Start Receving");
	});

	$('#close').on('click', function(){
		if(socket != undefined && socket.readyState == WebSocket.OPEN)
		{
			console.log('Close Receving');
			socket.close();
		}
	});
});
