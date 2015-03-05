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
function Party() {
  this.deck1= [];  this.deck2= [];
  this.hand1= [];  this.hand2= [];
  this.init = function() {
    for (var i = 1, l = 3; i < l; i++) this.hand1.push(Math.round(Math.random() * 6 + 1));
    for (var i = 1, l = 4; i < l; i++) this.hand2.push(Math.round(Math.random() * 6 + 1));
    for (var i = 1, l = 90; i < l; i++) {
      this.deck1.push(Math.round(Math.random() * 6 + 1))
      this.deck2.push(Math.round(Math.random() * 6 + 1))
    }
    console.log('Party init '+this.hand1);
    console.log(this.hand2);
  };
}
//-----------------------------------------------------------
// connection of a socket
io.on('connection', function(socket){
  console.log('io.on connection');
  //-----------------------------------------------------------
  //-----------------------------------------------------------
  socket.on('joinparty', function (data) {
    console.log('socket.on joinparty '+data.party_name);
    socket.game = data.party_name;
    socket.join(data.party_name);
    game= new Party();
    game.init();
    // send a message to the room socket.game exept the sender
    /*socket.broadcast.to(socket.game).emit('sendroom', {
      login: data.login,
      message: data.message
    });*/
    // send joinparty to all socket exept the sender
    //socket.broadcast.emit('joinparty', {
    // send a message to the room socket.game exept the sender
    socket.broadcast.to(socket.game).emit('joinparty', {
      login: data.login,
      party_name: data.party_name,
      hand: game.hand1
    });
    // send joinparty only to the sender
    socket.emit('joinparty', {
      login: data.login,
      party_name: data.party_name,
      hand: game.hand2
    });
  });
  //-----------------------------------------------------------
  socket.on('createparty', function (data) {
    console.log('socket.on createparty '+data.party_name);
    socket.game = data.party_name;
    socket.join(data.party_name);
    // send createparty to all socket exept the sender
    socket.broadcast.emit('createparty', {
      login: data.login,
      party_name: data.party_name
    });
    // send createparty only to the sender
    socket.emit('createparty', {
      login: data.login,
      party_name: data.party_name
    });
  });
  //-----------------------------------------------------------
  socket.on('sendroom', function (data) {
    console.log('socket.on sendroom');
    // send a message to the room socket.game exept the sender
    socket.broadcast.to(socket.game).emit('sendroom', {
      login: data.login,
      message: data.message
    });
    // send the message only to the sender
    socket.emit('sendroom', {
      login: data.login,
      message: data.message
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
