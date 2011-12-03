//setup express
var express = require('express');
var port = process.env.PORT || 80;
var app = express.createServer();
app.use(express.static(__dirname + "/Client"));


//setup socket.io
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  socket.emit('Welcome', 'Welcome!'); 
  socket.on('NewPlayer', function (player) {
    console.log(player);
    socket.broadcast.emit('NewPlayer',player);
  });
  socket.on('PlayerLeft',function (player) {
      console.log(player);
      socket.broadcast.emit('PlayerLeft',player);
  });
});

//setup redis
var redis = require('redis-url');
var db = redis.connect(process.env.REDISTOGO_URL);



//start the app
app.listen(port);
console.log("app is listening on %d", port);

db.set('foo', 'bar');
db.get('foo', function(err, value) {
  console.log('foo is: ' + value);
  console.log(err);
});