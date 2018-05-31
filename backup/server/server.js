const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generatelocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname,'../public');
const PORT = process.env.PORT || 3000 ;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.emit('newMessage',generateMessage("Admin","Welcome to chat app"));

	socket.broadcast.emit('newMessage',generateMessage("Admin","New user jioned"));

	socket.emit('newEmail',generateMessage("Me","Some text test"));

	socket.on('createEmail', (newEmail) => {
		console.log('createEmail', newEmail);
	});

	socket.on('createMessage', (message,callback) => {
		console.log('createMessage', message);
		/*io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});*/

		socket.broadcast.emit('newMessage',generateMessage(message.from,message.text));
		socket.emit('newMessage',generateMessage(message.from,message.text));
		callback();

	});

	socket.on('createlocatonMessage',(coords) => {
		io.emit('newlocationMessage',generatelocationMessage("Admin ",coords.lat,coords.lng));
	});
	socket.on('disconnect',() => {
		console.log('User was disconnect');
	});
});

server.listen(PORT, () => {
	console.log(`Started up at port ${PORT}`);
})