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

app.use(express.static(__dirname));

io.sockets.on('connection', function(socket){
    socket.on('subscribe', function(room) {
        console.log('joining room', room);
        socket.join(room);
    })

    socket.on('unsubscribe', function(room) {
        console.log('leaving room', room);
        socket.leave(room);
    })

    socket.on('send', function(data) {
        console.log('sending message '+data.room);
        io.sockets.in(data.room).emit('message', 'eeeee');
    });
});
