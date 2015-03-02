// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
//-----------------------------------------------------------
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname));
//-----------------------------------------------------------
// connection of a socket
io.on('connection', function(socket){
  console.log('io.on connection');
  //-----------------------------------------------------------
  //-----------------------------------------------------------
  socket.on('joinparty', function (data) {
    console.log('socket.on joinparty '+data.partie_name);
    socket.game = data.partie_name;
    socket.join(data.partie_name);
    // send joinparty to all socket exept the sender
    socket.broadcast.emit('joinparty', {
      login: data.login,
      partie_name: data.partie_name
    });
    // send joinparty only to the sender
    socket.emit('joinparty', {
      login: data.login,
      partie_name: data.partie_name
    });
  });
  //-----------------------------------------------------------
  socket.on('createparty', function (data) {
    console.log('socket.on createparty '+data.partie_name);
    socket.game = data.partie_name;
    socket.join(data.partie_name);
    // send createparty to all socket exept the sender
    socket.broadcast.emit('createparty', {
      login: data.login,
      partie_name: data.partie_name
    });
    // send createparty only to the sender
    socket.emit('createparty', {
      login: data.login,
      partie_name: data.partie_name
    });
  });
  //-----------------------------------------------------------
  socket.on('sendall', function (data) {
    console.log('socket.on sendall');
    // send a message to all socket exept the sender
    socket.broadcast.emit('sendall', {
      login: data.login,
      message: data.message
    });
    // send the message only to the sender
    socket.emit('sendall', {
      login: data.login,
      message: data.message
    });
  });
//-----------------------------------------------------------
});
//-----------------------------------------------------------
