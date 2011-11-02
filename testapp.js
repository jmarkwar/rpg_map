var app = require('express').createServer(),
    io = require('socket.io').listen(app);

var port = process.env.PORT; // || 80;

app.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('Welcome', 'Welcome!'); 
  socket.on('NewPlayer', function (player) {
    console.log(player);
  });
});