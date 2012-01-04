//Class player -- object used to encapsulate all the data related to a player
function player(name) {
    var self = this;
    self.setName(name);
    return true;
}

player.prototype = {
    constructor: player,
    name: function () { 
        return self._name; 
        
    },
    setName: function (newName) { 
        self._name = newName;
    }
};