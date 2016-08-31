/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Game = {
    
    getTeamName: function (key) {
        switch (key) {
            case Enum.Team.Blue:    return 'EQUIPE BLEU';
            case Enum.Team.Red:     return 'EQUIPE ROUGE';
            case Enum.Team.Green:   return 'EQUIPE VERT';
            case Enum.Team.Yellow:  return 'EQUIPE JAUNE';
        }
        return key;
    }
    
};

Game[Enum.Game.Type.DeadMatch] = {};
Game[Enum.Game.Type.DeadMatchTeam2] = {};
Game[Enum.Game.Type.DeadMatchTeam4] = {};
Game[Enum.Game.Type.CaptureFlag] = {};
