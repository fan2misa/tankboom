/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Game[Enum.Game.Type.DeadMatch] = {
    
    players: {},
        
    healt: 3,
    
    life: 3,
    
    construct: function () {
        this.players = {};
    },
    
    getDefaultTeam: function () {
        return 'default';
    },
    
    startGame: function () {
        var points = MAP.clonePoints(Server.game, Server.map);
        for (var i in this.players) {
            this.players[i].healt = this.healt;
            this.players[i].life = this.life;
            var point = MAP.getPoint(points, this.players[i].team);
            points.splice(points.indexOf(point), 1);
            this.players[i].position = point;
        }
    },
    
    addPlayer: function (user) {
        this.players[user.id] = user;
    },
    
    removePlayer: function (id) {
        delete this.players[id];
    },
    
    respawn: function (id) {
        this.players[id].position = MAP.getPoint(MAP.clonePoints(Server.game, Server.map), this.players[id].team);
        this.players[id].healt = this.healt;
    },
    
    isEndGame: function () {
        return Object.keys(this.players).length === 1;
    },
    
    endGame: function () {
        this.players = {};
    },
    
    getWinner: function () {
        return this.players[Object.keys(this.players)[0]].username;
    }
    
};
