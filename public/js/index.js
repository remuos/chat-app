var socket = io();
	socket.on('connect', function() {
		console.log('Connected to server');
	});
	socket.on('disconnect', function() {
		console.log('Disconnected from the server');
	});
	socket.emit('createEmail',{
		to:'jen@jen.com',
		text: "Hey . some text"
	})
	socket.on('newEmail', function(email){
		console.log('New email', email);
	});

	socket.on('newMessage', function(message){
		console.log('newMessage', message);
	});