/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Game[Enum.Game.Type.CaptureFlag] = {
    
    players: {},
    
    teams: {},
    
    construct: function () {
        this.teams[Enum.Team.Blue]   = 0;
        this.teams[Enum.Team.Red]    = 0;
    },
    
    getDefaultTeam: function () {
        return Enum.Team.Blue;
    },
    
    startGame: function () {
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
    
    removePlayer: function (user) {
        this.teams[user.team]--;
        if (this.teams[user.team] <= 0) {
            delete this.teams[user.team];
        }
        delete this.players[user.id];
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
