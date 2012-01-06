//class message -- message passed between chat clients



function chatMessage(channel,message,player) {
    var self= this;
    self.message = message;
    self.channel = channel;
    self.player = player;

    return true;
}

function NewPlayerEvent(channel,player) {
    var self=this;
    
    self.player = player;
    self.channel = channel;

    return true;
}

function ChatWindow(channelName,chatClient) {
    var self= this;
    self._channel = channelName;
    self._client = chatClient;
    self._players = {};
    
    self._chatWindow = $('<div class="ChatWindow"></div>');
    self._chatLogWindow = $('<div class="Log">Chat Log:<br /></div>');
    self._chatWindow.append(self._chatLogWindow);
    
    self._chatPlayerListWindow = $('<div class="Players">Current players:<br /></div>');
    self._chatPlayerList = $('<ul></ul>');
    self._chatPlayerListWindow.append(self._chatPlayerList);
    self._chatWindow.append(self._chatPlayerListWindow);
    
    self._chatInput = $('<input name="messageText"></input>');
    self._chatSaySomethingButton = $('<input type="button" value="Say Something" class="ChatButton"></input>');
    self._chatSaySomethingButton.click(function(){self.sendMessage(self._chatInput.val());
                                                  self._chatInput.val("");
    });
    self._chatWindow.append(self._chatInput);
    self._chatWindow.append(self._chatSaySomethingButton);
       
    self.NewPlayer = function (player) {
        self._players[player] = player;
        self._chatLogWindow.append( player + " has joined the fun<br />");
        self._chatPlayerList.append('<li name=' + player + '>' + player + '</li>');
    };
    
    self.RemovePlayer = function (player) {
        self._players[player] = null;
        self._chatPlayerList.find('[name="' + player +'"]').remove();
    };
    
    self.NewMessage = function (message) {
        self._chatLogWindow.append(message.player + ": " + message.message + "<br/>");
    };
    
    self.sendMessage = function (messageText) {
        var message = new chatMessage(self._channel,messageText);
        self._client.SendMessage(message);        
    };
    
    self.Welcome = function (playerlist) {
        for (var i=0;i< playerlist.length;i++)  {
            self._chatPlayerList.append('<li name=' + playerlist[i] + '>' + playerlist[i] + '</li>');
        }
    };
    
    self.NewPlayer(self._client._me.name());
    $('body').append(self._chatWindow);
    return true;   
}

// Class ChatClient -- client used to chat with other players
function ChatClient(player) {
    var self = this;
    self._me = player;
    self._channels = [];
    self._windows = {};
    self._socket = io.connect('http://freezing-light-6313.herokuapp.com/');
    
    //events recieved
    self._socket.on('NewPlayer',function(player) {
        self._windows[player.channel].NewPlayer(player.player);
    });
      
    self._socket.on('PlayerLeft',function(player) {
        self._windows[player.channel].RemovePlayer(player.player);
    });
    
    self._socket.on('ChatMessage',function(message) {
        self._windows[message.channel].NewMessage(message);
    });
    self._socket.on('Invitation',function(invitation) {
        console.log(invitation);
    });
    self._socket.on('Welcome', function (playerlist){
        self._windows[playerlist.channel].Welcome(playerlist.list);
    });
    
    //events sent
    self.Leave = function () {
       self._socket.emit('PlayerLeft',self._me);
    };
    
    self.Invite = function (player) {
        self._socket.emit('InvitePlayer',player);
    };
    
    self.Join = function(channelName) {
        var player = new NewPlayerEvent(channelName,self._me.name());
        self._channels.push(channelName);
        self._windows[channelName] = new ChatWindow(channelName,self);
        self._socket.emit('PlayerJoined',player);
    };
    
    self.CreateChannel = function (channelName) {
        self._socket.emit('CreateChannel',channelName);
    };
    
    self.DestroyChannel = function (channelName) {
        self._socket.emit('DestroyChannel',channelName);
    };
    
    self.SendMessage = function (message) {
        message.player = self._me.name();
        self._socket.emit('ChatMessage',message);
    };
    
    return true;
}





