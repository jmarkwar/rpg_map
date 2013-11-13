//class chatMessage -- encapsulates message data passed between chat clients
function chatMessage(channel,message,player) {
    var self= this;
    
    self.message = message;
    self.channel = channel;
    self.player = player;

    return true;
}

//class NewPlayerEvent -- encapsulates data needed to process a new player event
function NewPlayerEvent(channel,player) {
    var self=this;
    
    self.player = player;
    self.channel = channel;

    return true;
}

//class ChatWindow -- encapsulates the data and methods required to display chat messages and notifications, and to process the user events generated for a specific chat channel
function ChatWindow(channelName,chatClient) {
    var self= this;
    
    self._channel = channelName;
    self._client = chatClient;
    self._players = {};
    
    //set up the main chat area
    self._chatWindow = $('<div class="ChatWindow"></div>');
    //setup the chat log area
    self._chatLogContainer = $('<div class="Log">Chat Channel:' + self._channel + '<br /></div>');
    self._chatLogContainer.append('<div class="LogMessages"></div>');
    self._chatLogWindow = $('<div></div>');
    self._chatLogContainer.find('.LogMessages').append(self._chatLogWindow);
    self._chatWindow.append(self._chatLogContainer);
    //setup the player list 
    self._chatPlayerListWindow = $('<div class="Players">Current players:</div>');
    self._chatPlayerList = $('<ul></ul>');
    self._chatPlayerListWindow.append(self._chatPlayerList);
    self._chatWindow.append(self._chatPlayerListWindow);
    //setup the chat input line
    self._chatInputArea = $('<div class="chatInput"></div>');
    self._chatInput = $('<input name="messageText"></input>');
    self._chatInput.keyup(function (e) {
        if(e.which == 13)
        {
            self.sendMessage();
        }
    });
    self._chatSaySomethingButton = $('<input type="button" value="Say Something" class="ChatButton"></input>');
    self._chatSaySomethingButton.click(function(){self.sendMessage();});
    self._chatInputArea.append(self._chatInput);
    self._chatInputArea.append(self._chatSaySomethingButton);
    self._chatLogContainer.append(self._chatInputArea);
    
    //process the new player event
    self.NewPlayer = function (player) {
        self._players[player] = player;
        self._chatLogWindow.append( player + " has joined the fun<br />");
        self._chatPlayerList.append('<li name=' + player + '>' + player + '</li>');
    };
    
    //process the remove player event
    self.RemovePlayer = function (player) {
        self._players[player] = null;
        self._chatPlayerList.find('[name="' + player +'"]').remove();
    };
    
    //process the new chat message event
    self.NewMessage = function (message) {
        self._chatLogWindow.append(message.player + ": " + message.message + "<br/>");
        self._chatLogWindow.prop({ scrollTop: self._chatLogWindow.prop("scrollHeight") });
    };
    
    //send a new chat message 
    self.sendMessage = function (messageText) {
        if (messageText === undefined){
            messageText = self._chatInput.val();
        }
        var message = new chatMessage(self._channel,messageText);
        self._client.SendMessage(message); 
        self._chatInput.val("");
    };
    
    //process the welcome event when joining a channel
    self.Welcome = function (playerlist) {
        for (var i=0;i< playerlist.length;i++)  {
            self._chatPlayerList.append('<li name=' + playerlist[i] + '>' + playerlist[i] + '</li>');
        }
    };
    
    //add the chat window to the DOM, and make sure the current player is in the player list
    self.NewPlayer(self._client._me.name());
    $('#chat').append(self._chatWindow);
    return true;   
}

// Class ChatClient -- encapsulates the data and functions required to communicate with the chat server
function ChatClient(player) {
    var self = this;
    
    self._me = player;
    self._channels = [];
    self._windows = {};
    //self._socket = io.connect('http://freezing-light-6313.herokuapp.com/');
    self._socket = io.connect('https://rpg_map_github-c9-jmarkwar.c9.io/');
    
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
    //--not implemented
    self.Leave = function () {
       self._socket.emit('PlayerLeft',self._me);
    };
    
    //--not implemented
    self.Invite = function (player) {
        self._socket.emit('InvitePlayer',player);
    };
    
    self.Join = function(channelName) {
        var player = new NewPlayerEvent(channelName,self._me.name());
        self._channels.push(channelName);
        self._windows[channelName] = new ChatWindow(channelName,self);
        self._socket.emit('PlayerJoined',player);
    };
    //--not implemented
    self.CreateChannel = function (channelName) {
        self._socket.emit('CreateChannel',channelName);
    };
    //--not implemented
    self.DestroyChannel = function (channelName) {
        self._socket.emit('DestroyChannel',channelName);
    };
    
    self.SendMessage = function (message) {
        message.player = self._me.name();
        self._socket.emit('ChatMessage',message);
    };
    
    return true;
}





