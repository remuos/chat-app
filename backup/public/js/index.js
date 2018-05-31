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
		var li = document.createElement('LI');
		li.textContent =message.from+': '+message.text;
		document.getElementById('messages').appendChild(li);
	});

	/*socket.emit('createMessage',{
		from: 'Frank',
		text: 'Hi'
	}, function  (message) {
		console.log('Got it', message) ;
	});*/


//
var form = document.getElementById('message-form');

form.addEventListener('submit', function(e){
	e.preventDefault();
	socket.emit('createMessage',{
		from: 'User',
		text: form.querySelector('[name=message]').value 
	}, function () {
		form.querySelector('[name=message]').value="";
	});
});

var locationBtn = document.getElementById('sendlocation');
locationBtn.addEventListener('click', function(e){
	if(!navigator.geolocation){
		alert('geolocation not supported in your browser' );
		return;
	}

	navigator.geolocation.getCurrentPosition( function(position){
		console.log(position);
		socket.emit('createlocatonMessage',{
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		});
	}, function(){
		alert('Unable to fetch locaton');
	});

	socket.on('newlocationMessage',function(message) {
		var li = document.createElement('LI');
		var a = document.createElement('A');
		console.log(message);

		li.textContent = message.from+': '+message.text;
		document.getElementById('messages').appendChild(li);
	});

});