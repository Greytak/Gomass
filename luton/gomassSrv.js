//-----------------------------------------------------------
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
// Include common code with client
//var fs = require('fs');
//eval(fs.readFileSync('common.js')+'');
create_card(); // list of card models
//-----------------------------------------------------------
var games= []; // list of games
//-----------------------------------------------------------
function Player(socket_id) {
  this.socket_id= socket_id;  this.board= [];  this.deck= [];
}
//-----------------------------------------------------------
//  client board:
//  0 1  4   10 11 12 13
//  2 3  5    6  7  8  9
function Game() {
  this.init = function() {
    // random player begins, has the card n°9 and 3 hand card the other n°8 and 4
    if (Math.random()<.5) {
      var player1= this.player_create;
      var player2= this.player_join;
    } else {
      var player1= this.player_join;
      var player2= this.player_create;
    }
    this.player_turn= player1.socket_id;
    player1.board[5]= new Card(8);
    player2.board[4]= player1.board[5];
    player2.board[5]= new Card(7);
    player1.board[4]= player2.board[5];
    for (var i = 0; i < 2; i++)
      player1.board[i]= new Card(Math.round(Math.random() * 6));
    for (var i = 0; i < 3; i++)
      player2.board[i]= new Card(Math.round(Math.random() * 6));
    // other board null ??
    // random from 1 to 7 integer deck
    for (var i = 1, l = 90; i < l; i++) {
      player1.deck.push(Math.round(Math.random() * 6))
      player2.deck.push(Math.round(Math.random() * 6))
    }
    console.log('Party init player1.board[1]= '+player1.board[1].title_card);
  };
}
//-----------------------------------------------------------
function determine_players(thegame) {
  if (thegame.player_turn==thegame.player_create.socket_id) {
    var my_player= thegame.player_create;
    var other_player= thegame.player_join;
  }
  else {
    var my_player= thegame.player_join;
    var other_player= thegame.player_create;
  }
  return {my : my_player, other : other_player};
}
//-----------------------------------------------------------
// connection of a socket
io.on('connection', function(socket){
  console.log('io.on connection');
    //-----------------------------------------------------------
    socket.on('turnswap', function (data) {
      var thegame= games[data.party_name];
      if (thegame.player_turn!=socket.id) return;
      var players= determine_players(thegame);
      thegame.player_turn= players.other.socket_id;
      // send a message to the room socket.game exept the sender
      socket.broadcast.to(data.party_name).emit('turnswap', {
        player_turn: thegame.player_turn
      });
      // send message only to the sender
      socket.emit('turnswap', {
        player_turn: thegame.player_turn
      });
    });
    //-----------------------------------------------------------
    function summon(data) {
      var thegame= games[data.party_name];
      // if it is not your turn : exit
      if (thegame.player_turn!=socket.id) return;
      var players= determine_players(thegame);
      // if source card does not exist : exit
      if (! players.my.board[data.src_num]) return;
      console.log('summon : data.src_num= '+data.src_num+' data.dst_num '+data.dst_num+' title '+ players.my.board[data.src_num].title_card);
      if (players.my.board[data.dst_num]) rerturn; // if dst not empty return

      players.my.board[data.dst_num]= players.my.board[data.src_num];
      players.other.board[data.dst_num + 4]= players.my.board[data.src_num];
      players.my.board[data.src_num]= null;
      socket.broadcast.to(data.party_name).emit('addcard', {
        num_card: data.dst_num + 4,
        card: players.my.board[data.dst_num]
      });
      socket.emit('addcard', {
        num_card: data.dst_num,
        card: players.my.board[data.dst_num]
      });
      socket.emit('rmcard', { num_card: data.src_num });
    }
    //-----------------------------------------------------------
    function attack(data) {
      var thegame= games[data.party_name];
      // if it is not your turn : exit
      if (thegame.player_turn!=socket.id) return;
      var players= determine_players(thegame);
      // if source card does not exist : exit
      if (! players.my.board[data.src_num]) return;
      console.log('attack : data.src_num= '+data.src_num+' data.dst_num '+data.dst_num+' title '+ players.my.board[data.src_num].title_card);
      if (! players.my.board[data.dst_num]) return; // if dst empty return

      players.my.board[data.dst_num].def -= players.my.board[data.src_num].atk;
      players.my.board[data.src_num].def -= players.my.board[data.dst_num].atk;
      //debugger;
      console.log('players.my.board[data.src_num].title_card '+players.my.board[data.src_num].title_card);
      console.log('players.my.board[data.src_num].def ' + players.my.board[data.src_num].def + ' players.other.board[data.src_num + 4].def '+ players.other.board[data.src_num + 4].def);
      console.log('players.my.board[data.dst_num].title_card '+players.my.board[data.src_num].title_card);
      console.log('players.my.board[data.dst_num].def ' + players.my.board[data.dst_num].def + ' players.other.board[data.dst_num - 4].def '+ players.other.board[data.dst_num - 4].def);

      if (players.my.board[data.dst_num].def <= 0) {
        players.my.board[data.dst_num]= null;
        socket.emit('rmcard', { num_card: data.dst_num });
        players.other.board[data.dst_num - 4]= null;
        socket.broadcast.to(data.party_name).emit('rmcard', { num_card: data.dst_num - 4 });
      } else {
        socket.emit('chcard', { num_card: data.dst_num, card: players.my.board[data.dst_num] });
        socket.broadcast.to(data.party_name).emit('chcard', { num_card: data.dst_num - 4, card: players.my.board[data.dst_num] });
      }

      if (players.my.board[data.src_num].def <= 0) {
        players.my.board[data.src_num]= null;
        socket.emit('rmcard', { num_card: data.src_num });
        players.other.board[data.src_num + 4]= null;
        socket.broadcast.to(data.party_name).emit('rmcard', { num_card: data.src_num + 4 });
      } else {
        socket.emit('chcard', { num_card: data.src_num, card: players.my.board[data.src_num] });
        socket.broadcast.to(data.party_name).emit('chcard', { num_card: data.src_num + 4, card: players.my.board[data.src_num] });
      }
    }
    //-----------------------------------------------------------
    socket.on('move_card', function (data) {
      //  0 1  4   10 11 12 13
      //  2 3  5    6  7  8  9
      console.log('socket.on move_card '+data.party_name+ ' id '+ socket.id);
      // if src in my hand and dst in my field : summon
      if (data.src_num>=0 && data.src_num<=3)
      if (data.dst_num>=6 && data.dst_num<=9) summon(data);
      // if src in my field and dst in other field : attack
      if (data.src_num>=6 && data.src_num<=9)
      if (data.dst_num>=10 && data.dst_num<=13) attack(data);
    });
  //-----------------------------------------------------------
  socket.on('joinparty', function (data) {
    console.log('socket.on joinparty '+data.party_name+ ' id '+ socket.id);
    var thegame= games[data.party_name];
    thegame.player_join= new Player(socket.id);
    socket.join(data.party_name);
    thegame.init();
    //current console.log('check board[1] player1.board[1]= '+player1.board[1].title_card);
    // send a message to the room socket.game exept the sender
    socket.broadcast.to(data.party_name).emit('joinparty', {
      login: data.login,
      party_name: data.party_name,
      board: thegame.player_create.board,
      player_turn: thegame.player_turn
    });
    // send joinparty only to the sender
    socket.emit('joinparty', {
      login: data.login,
      party_name: data.party_name,
      board: thegame.player_join.board,
      player_turn: thegame.player_turn
    });
  });
  //-----------------------------------------------------------
  socket.on('createparty', function (data) {
    console.log('socket.on createparty '+data.party_name+ ' id '+ socket.id);
    games[data.party_name]= new Game();
    var thegame= games[data.party_name];
    thegame.player_create= new Player(socket.id);
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
    socket.emit('sendall', {
      login: 'sys',
      message: 'msg before return'
    });
  });
//-----------------------------------------------------------
});


//-----------------------------------------------------------
// common.js test eval at the end ??
//-----------------------------------------------------------
function create_card() {
  card_models=[];
  card_models.push(new Card_model('soldier', 'Ready...', 1, 1, 1, 0));
  card_models.push(new Card_model('sergeant', 'Yes...', 2, 1, 2, 1));
  card_models.push(new Card_model('lieutenant', 'Ok...', 3, 2, 2, 2));
  card_models.push(new Card_model('captain', 'Go...', 4, 2, 3, 3));
  card_models.push(new Card_model('colonel', 'Prepare...', 5, 3, 3, 4));
  card_models.push(new Card_model('marshal', 'Think...', 6, 3, 4, 5));
  card_models.push(new Card_model('general', 'Serve...', 7, 4, 3, 6));
  card_models.push(new Card_model('player', '', 0, 1, 20, 7));
  card_models.push(new Card_model('player', '', 0, 1, 20, 8));
}
function Card_model(title_card, text_card, cost, atk, def, image_num) {
  this.title_card= title_card; this.text_card= text_card; this.cost= cost;
  this.atk= atk; this.def= def; this.image_num= image_num;
}
function Card(model_num) {
  this.model_num= model_num;
  this.title_card= card_models[model_num].title_card;
  this.text_card= card_models[model_num].text_card;
  this.atk= card_models[model_num].atk;  this.def= card_models[model_num].def;
  this.cost= card_models[model_num].cost;
  this.image_num= card_models[model_num].image_num;
}
// http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
//-----------------------------------------------------------


//-----------------------------------------------------------
// poub
//-----------------------------------------------------------
// test return ok
/*return;
socket.emit('sendall', {
  login: 'sys',
  message: 'msg after return'
});*/
// test multi-emit ok
/*socket.emit('sendroom', {
  login: 'test',
  message: ' test msg'
});*/

//-----------------------------------------------------------
//-----------------------------------------------------------
