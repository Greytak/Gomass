// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var server = require('http').createServer();
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname));

io.on('connection', function(socket){
  console.log('io.on connection');

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

});
