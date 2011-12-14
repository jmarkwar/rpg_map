//setup express
var express = require('express');
var port = process.env.PORT || 80;
var app = express.createServer();
app.use(express.static(__dirname + "/Client"));
var channels = [];

//setup redis

var dbpass='f1950093dd1b22206143b59f0592211c';
var dbhost='viperfish.redistogo.com';
var dbport='9694';

var redis = require('redis');
var db = redis.createClient(dbport,dbhost);
db.auth(dbpass);

//setup socket.io
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  socket.emit('Welcome', channels); 
  socket.on('NewPlayer', function (player) {
    console.log(player);
    socket.broadcast.emit('NewPlayer',player);
  });
  socket.on('PlayerLeft',function (player) {
    console.log(player);
    socket.broadcast.emit('PlayerLeft',player);
  });
  socket.on('CreateChannel',function (channel) {
    console.log(channel);
    channels.push(channel);
    if(db.exists('channels'))
    {
        db.append('channels',channel);
    } else {
        db.set('channels',channel);
    }
    console.log(channels);
    db.get('channels',function (err,value) {
        console.log('channels is' + value);
        console.log(err);
    });
  });
});





//start the app
app.listen(port);
console.log("app is listening on %d", port);

db.set('foo', 'bar');
db.get('foo', function(err, value) {
  console.log('foo is: ' + value);
  console.log(err);
});