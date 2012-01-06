//setup express to serve static content
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

//setup player array
var players = {};

//setup socket.io
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
    //this is the server.  there will be one copy of this function spawned for each connection
    
    //each connection gets a connection to the db
    var dbclient = redis.createClient(dbport,dbhost);
    dbclient.auth(dbpass);
    
    //when there's a message published to a channel that this client is listening on, send the message to the client
    dbclient.on('message',function(channel,message){
        console.log(message);
        var parts = message.split(":");
        var chatMessage = { channel: channel, player: parts[0], message: parts[1] };
        socket.emit('ChatMessage',chatMessage);
    });
    
    //when a player leaves the channel, remove them from the player list for that channel, unsubscribe them from that channel, and notify other clients they left that channel
    //--not implemented yet
    socket.on('PlayerLeft',function (player) {
        console.log(player);
        socket.broadcast.emit('PlayerLeft',player);
    });
    
    //when a new player joins a channel, add them to the player list for that channel, subscribe them to that channel, and notify other clients they joined the channel
    socket.on('PlayerJoined',function (player){
        console.log(player);
        dbclient.subscribe(player.channel);        
        socket.broadcast.emit('NewPlayer',player);        
        if(players[player.channel] === undefined){
           players[player.channel] = [];
        } else {
             socket.emit('Welcome',{channel: player.channel, list: players[player.channel]});
        }       
        players[player.channel].push(player.player);              
    });
    
    //when a player sends a chat message, publish it to the channel they sent it from
    socket.on('ChatMessage',function (chatMessage){
        console.log(chatMessage);
        publisher.publish(chatMessage.channel, chatMessage.player + ":" + chatMessage.message);
    });

});


//start the app
app.listen(port);
console.log("app is listening on %d", port);
