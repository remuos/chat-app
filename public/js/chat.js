var socket = io();

function scrolToBottom(){
  //selectors
  var messages = document.getElementById('messages');
  var newMessage = messages.querySelector('li:last-child');
  var clientHeight = messages.clientHeight ;
  var scrollTop = messages.scrollTop ;
  var scrollHeight = messages.scrollHeight ;
  var newMessageHeight = newMessage.offsetHeight ;
  var lastMessageHeight = newMessage.previousSibling.previousSibling && newMessage.previousSibling.previousSibling.offsetHeight;

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop = scrollHeight;
  }
}
socket.on('connect', function () {
  //console.log('Connected to server');
  var params = window.location.deparam(window.location.search);
  socket.emit('join',params,function(err){
      if (err) {
        alert(err);
        window.location.href = '/';
      } else {
        console.log('No error');
      }
  });

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){
    var ol = document.createElement('OL');
    users.forEach( function(user, index) {
      //console.log('user : ',user);
      var li = document.createElement('LI');
      li.textContent = user;
      ol.appendChild(li);

    });
    document.getElementById('users').innerHTML = ol.outerHTML;
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.getElementById('message-template').innerHTML ;
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  
  document.getElementById('messages').innerHTML += html;
  scrolToBottom();
  /*var formattedTime = moment(message.createdAt).format('h:mm a');
  console.log('newMessage', message);
  var li = document.createElement('LI');
  li.textContent = `${message.from} ${formattedTime}: ${message.text}`;
  document.getElementById('messages').appendChild(li);*/
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = document.getElementById('location-message-template').innerHTML ;
  var html = Mustache.render(template,{
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  document.getElementById('messages').innerHTML += html;
  scrolToBottom();
  /*var li = document.createElement('LI');
  var a = document.createElement('A');
  a.textContent ="My current location";
  a.setAttribute('target', "_blank");

  li.textContent = `${message.from}: ${formattedTime}`;
  a.setAttribute('href', message.url);
  li.appendChild(a);
  document.getElementById('messages').appendChild(li);*/

});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = document.querySelector('[name=message]');

  socket.emit('createMessage', {
    //from: 'User',
    text: messageTextbox.value 
  }, function () {
    messageTextbox.value = "";
  });
});

var locationButton = document.getElementById('send-location');
locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.textContent = 'Sending location...';

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send location';
    alert('Unable to fetch location.');
  });
});
