//class message -- message passed between chat clients

function chatMessage(channel,message) {
    var self= this;
    self._message = message;
    self._channel = channel;
    
    self.getMessage = function () {
        return self._message;
    };
    
    self.setMessage = function (messageText) {
        self._message = messageText;
    };
    
    self.getChannel = function () {
        return self._channel;
    };
    
    self.setChannel = function (channelName) {
        self._channel = channelName;
    };
    
    return true;
}

function newPlayer(channel,player) {
    var self=this;
    
    self._player = player;
    self._channel = channel;
    
    self.getPlayer = function () {
        return self._player;
    };
    
    self.setPlayer = function (player) {
        self._player = player;
    };
    
    self.getChannel = function () {
        return self._channel;
    };
    
    self.setChannel = function (channelName) {
        self._channel = channelName;
    };
    
    return true;
}


// Class ChatClient -- client used to chat with other players
function ChatClient() {
    var self = this;
    self._players = [];
    self._me = { };
    self._channels = [];
    self._windows = {};
    self._socket = io.connect('http://rpg_map.jmarkwar.c9.io');
    
    self._socket.on('NewPlayer',function(player) {
        self._windows[player.getChannel()].newPlayer(player.getPlayer());
    });
      
    self._socket.on('PlayerLeft',function(player) {
        self._windows[player.getChannel()].removePlayer(player.getPlayer());
    });
    
    self._socket.on('Message',function(message) {
        console.log(message);
        self._windows[message.getChannel()].newMessage(message.getMessage());
    });
    
    self.Leave = function () {
        alert('Leaving Things!');
       self._socket.emit('PlayerLeft',self._me);
    };
    
    self.Join = function(channelName) {
        var player = NewPlayer(channelName,self._me);
        self._channels.push(channelName);
        self._windows[channelName] = new ChatWindow(channelName,self);
        self.emit('subscribe',player);
    };
    
    self.addPlayer = function (np) {
      self._players.push(np);
      $('#playerList ul').append('<li>' + np.name() + '</li>');  
    };
    
    self.createChannel = function () {
        var channelName = $('[name="channelName"]').val();
        self._socket.emit('CreateChannel',channelName);
    };
    
    self.sendMessage = function (message) {
        self._socket.emit('message',message);
    };
    
    return true;
}





