function joinChat(channelName){
    var me = new player($('[name = "Name"]').val());
    var client = new ChatClient(me);
    client.Join(channelName);
    $('[name="signon"]').hide();
}

function init() {
    $('.input').keyup(function(e){
        if(e.which == 13){
            joinChat("Default");
            return false;
        }
    });
    
    $('.JoinButton').click( function () {
        joinChat("Default");
    });
    
}



$(document).ready(function (){ init(); });