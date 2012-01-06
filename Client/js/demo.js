function init() {
    
    $('.JoinButton').click( function () {
        var me = new player($('[name = "Name"]').val());
        var client = new ChatClient(me);
        client.Join('Default');
        $('[name="signon"]').hide();
    });
    
}



$(document).ready(function (){ init(); });