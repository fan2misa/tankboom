/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var MAP = {
    getPoint: function (points, team) {
        var pts = points.filter(function(element) {
            return null === team || Enum.Team.Default === team || element.team === undefined || element.team === team;
        });
        return pts[Math.floor(Math.random() * pts.length)];
    },
    clonePoints: function (game, map) {
        return MAP[game][map].points.slice(0);
    }
};

MAP[Enum.Game.Type.DeadMatch] = {};
MAP[Enum.Game.Type.DeadMatchTeam2] = {};
MAP[Enum.Game.Type.DeadMatchTeam4] = {};
MAP[Enum.Game.Type.CaptureFlag] = {};
