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
/*
app.get('/', function(req, res){
  res.send('hello world');
});
*/
app.use(express.static(__dirname));
// Movement
function Move(user, srcx, srcy, dstx, dsty) {
  this.userName = user;
  this.srcx = srcx;
  this.srcy = srcy;
  this.dstx = dstx;
  this.dsty = dsty;
}
// usernames which are currently connected to the chat
var allUsers = new Array();
var allMove = [];
var allRoom = [];
function storeMovement(user, srcx, srcy, dstx, dsty) {
  allMove.push(new Move(user, srcx, srcy, dstx, dsty));
}

// default namespace
io.on('connection', function (socket) {
  console.log('connection to namespace : ' + io.name);
  console.log('connection to the soket : ' + socket.id);

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    console.log('add user : ' + username);
    // we store the username in the socket session for this client
    socket.username = username;
    socket.register = true;
    // add the client's username to the global list
    allUsers.push(username);
    socket.emit('login', {
      numUsers: allUsers.length,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: allUsers.length
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
    socket.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'move', we broadcast it to others
  socket.on('move', function (data) {
    console.log('received a new move from : ' + data.room);
    tempMove = data.message; //srcx, srcy, dstx, dsty
    tempMove.split(",");
    storeMovement(socket.username, tempMove[0], tempMove[1], tempMove[2], tempMove[3]);
    console.log('emit to room : ' + socket.game);
    //socket.broadcast.to(data.room).emit('myMove', {
    //io.sockets.in(data.room).emit('myMove', {
    socket.emit('myMove', {
      validated: "Move Ok.",
      move: data.message,
      player: socket.username
    });
    //socket.broadcast.to(data.room).emit('hisMove', {
    socket.broadcast.to(data.room).emit('hisMove', {
        validated: "New move.",
      move: data.message,
      player: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function (data) {
    console.log('disconnect1 : ' + data);
    if (allUsers.length > 0) {
      // remove the username from global allUsers list
      allUsers.pop();
      console.log('disconnect2 : ' + data);
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: allUsers.length
      });
    }
  });

  socket.on('newGame', function (gameName) {
    console.log('create a new game : ' + gameName);
    socket.game = gameName;
    socket.join(gameName);
    io.to(gameName).emit('newGameOk', {
    //socket.to(gameName).emit('newGameOk', {
      validated: "The game is created : " + gameName,
      game: gameName
    });
    socket.broadcast.emit('openGame', {
      validated: "A new game is created : " + gameName,
      game: gameName
    });
    //socket.leave(gameName);
  });

  socket.on('joinGame', function (gameName) {
    console.log('join a game : ' + gameName);
    socket.game = gameName;
    socket.join(gameName);
    io.to(gameName).emit('joinGameOk', {
    //socket.to(gameName).emit('joinGameOk', {
      validated: "You join the game : " + gameName,
      game: gameName
    });
    socket.broadcast.emit('closeGame', {
      validated: "The game is closed : " + gameName,
      game: gameName
    });
    //socket.leave(gameName);
  });
});

//socket.broadcast.to(data.room).emit('moveOk', {
//io.sockets.in(data.room).emit('moveOk', {

//socket.join(data.room);
//io.to(gameName)

//io.to(socket.game)
    /*
    socket.emit('myMove', {
      validated: "Move Ok."
    });
    socket.broadcast.emit('hisMove', {
      validated: movement
    });
    */

/*
// namespace Register Games
var register = io.of('/register');
register.on('connection', function(socket){
  console.log('someone connected');
});

// namespace Game
var gameOn = io.of('/game');
gameOn.on('connection', function(socket){
  console.log('someone connected');
  gameOn.emit('hi', 'everyone!');
});
*/
