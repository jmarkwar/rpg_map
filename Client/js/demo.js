function init() {
    $('.input').keyup(function(e){
        if(e.which == 13){
            var me = new player($('[name = "Name"]').val());
            var client = new ChatClient(me);
            client.Join('Default');
            $('[name="signon"]').hide();
            return false;
        }
    });
    
    $('.JoinButton').click( function () {
        var me = new player($('[name = "Name"]').val());
        var client = new ChatClient(me);
        client.Join('Default');
        $('[name="signon"]').hide();
    });
    
}



$(document).ready(function (){ init(); });