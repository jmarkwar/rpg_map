//setup express
var express = require('express');
var port = process.env.PORT || 80;
var app = express.createServer();
app.use(express.static(__dirname + "/Client"));

//setup redis

var dbpass='f1950093dd1b22206143b59f0592211c';
var dbhost='viperfish.redistogo.com';
var dbport='9694';

var redis = require('redis');
var publisher = redis.createClient(dbport,dbhost);
    publisher.auth(dbpass);
var players = {};
//setup socket.io
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
    
    var dbclient = redis.createClient(dbport,dbhost);
    dbclient.auth(dbpass);
    
    dbclient.on('message',function(channel,message){
        console.log(message);
        var parts = message.split(":");
        var chatMessage = { channel: channel, player: parts[0], message: parts[1] };
        socket.emit('ChatMessage',chatMessage);
    });
    
    socket.on('NewPlayer', function (player) {
        console.log(player);
        socket.broadcast.emit('NewPlayer',player);
    });
  
    socket.on('PlayerLeft',function (player) {
        console.log(player);
        socket.broadcast.emit('PlayerLeft',player);
    });
    
    socket.on('PlayerJoined',function (player){
        console.log(player);
        dbclient.subscribe(player.channel);
        
        socket.broadcast.emit('NewPlayer',player);
        socket.emit('Welcome',players[player.channel]);
        players[player.channel].push(player.player);
        
    });
    
    socket.on('ChatMessage',function (chatMessage){
        console.log(chatMessage);
        publisher.publish(chatMessage.channel, chatMessage.player + ":" + chatMessage.message);
    });

});


//start the app
app.listen(port);
console.log("app is listening on %d", port);
