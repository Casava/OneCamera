$(function(){

	var socket;

	var receiver = $("#receiver");
	receiver.css("width", 500);
	receiver.css("height", 250);
	receiver.css("background-color", "#000000");
	receiver.css("display", "block");

	$('#start').on('click', function(){
		console.log("started");
		// socket = new WebSocket("ws://onecamera.azurewebsites.net/OneCamera/OneCameraWebSocketHandler.ashx");
		socket = new WebSocket("ws://localhost:8080/receive", 'echo-portocol');

		socket.onopen = function(){
			console.log("connected");
		}

		socket.onmessage = function(data){
			receiver.attr('src', data.data);
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
