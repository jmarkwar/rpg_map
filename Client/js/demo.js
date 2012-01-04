function init() {
    var client = new ChatClient('Default');
    
    $('.JoinButton').click(client.Join);
    $('.LeaveButton').click(client.Leave);
    $('.CreateChannel').click(client.createChannel);
}



$(document).ready(function (){ init(); });