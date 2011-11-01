var app = require('express').createServer(), 
    io = require('socket.io').listen(app);

var port = process.env.C9_PORT || 80;

app.listen(port);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('NewConnection', { hello: 'world' });
  socket.on('CustonEvent', function (data) {
    console.log(data);
  });
});