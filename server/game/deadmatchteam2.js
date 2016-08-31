/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Game[Enum.Game.Type.DeadMatchTeam2] = {
    
    players: {},
    
    teams: {},
    
    healt: 3,
    
    life: 3,
    
    construct: function () {
        this.players = {};
        this.teams[Enum.Team.Blue]   = 0;
        this.teams[Enum.Team.Red]    = 0;
    },
    
    getDefaultTeam: function () {
        return Enum.Team.Blue;
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
        
        for (var i in this.teams) {
            if (this.teams[i] <= 0) {
                delete this.teams[i];
            }
        }
    },
    
    addPlayer: function (user) {
        this.players[user.id] = user;
        this.teams[user.team]++;
    },
    
    removePlayer: function (id) {
        this.teams[this.players[id].team]--;
        
        if (this.teams[this.players[id].team] <= 0) {
            delete this.teams[this.players[id].team];
        }
        delete this.players[this.players[id].id];
    },
    
    respawn: function (id) {
        Game[Server.game].players[id].position = MAP.getPoint(MAP.clonePoints(Server.game, Server.map), Game[Server.game].players[id].team);
        Game[Server.game].players[id].healt = this.healt;
    },
    
    isEndGame: function () {
        return Object.keys(this.teams).length === 1;
    },
    
    endGame: function () {
        this.players = {};
        this.teams = {};
    },
    
    getWinner: function () {
        return Game.getTeamName(Object.keys(this.teams)[0]);
    }
    
};
