
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', require('express').static(__dirname + '/web'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/web/index.html');
});

/**
 * SOCKETS
 * @type type
 */
io.on('connection', function (socket) {
    socket.on('USER_CONNECT', onUserConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('CHANGE_GAME_TYPE', onChangeGameType);
    socket.on('USER_CHANGE_TEAM', onUserChangeTeam);
    socket.on('USER_READY', onUserReady);
    socket.on('SET_POSITION', onSetPosition);
    socket.on('SET_TRACER', onSetTracer);
    socket.on('SET_FIRE', onSetFire);
    socket.on('SET_TANK_TOUCH', onSetTankTouch);
    socket.on('SET_TANK_EXPLOSE', onSetTankExplose);
    
    function onUserConnect(data) {
        Server.addUser(socket.id, data);
        console.log(Server.users[socket.id].username + ' HAS CONNECTED');
        socket.emit('USER_CONNECT_SUCCESS', {
            scene: Server.scene !== Enum.Scene.InGame ? Server.scene : Enum.Scene.Wait,
            game: Server.game,
            users: Server.users,
            user: Server.users[socket.id]
        });
        
        socket.broadcast.emit('NEW_USER_CONNECTED', {
            newUser: Server.users[socket.id]
        });
        
        if (Server.scene === Enum.Scene.MainMenu) {
            socket.broadcast.emit('REFRESH_USERS', {
                users: Server.users
            });
        }
    }
    
    function onDisconnect() {
        if (Server.scene === Enum.Scene.InGame) {
            if (Game[Server.game].players.hasOwnProperty(socket.id)) {
                Game[Server.game].players[socket.id].life = 0;
                onSetTankExplose();
            }
        }
        
        if (Server.users.hasOwnProperty(socket.id)) {
            console.log(Server.users[socket.id].username + ' HAS DISCONNECTED');
            delete Server.users[socket.id];
            Server.userscount--;
        }
        
        if (Server.noPlayers()) {
            Server.start();
        } else {
            if (Server.scene === Enum.Scene.MainMenu) {
                socket.broadcast.emit('REFRESH_USERS', {
                    users: Server.users
                });
            }
        }
    }
    
    function onChangeGameType(gameType) {
        Server.game = gameType;
        console.log(Server.users[socket.id].username + ' SET ' + Server.game);
        if (Server.scene === Enum.Scene.MainMenu) {
            Server.refreshUsersTeam();
            io.sockets.emit('GAME_TYPE_CHANGED', {
                game: Server.game,
                users: Server.users
            });
        }
    }
    
    function onUserChangeTeam(team) {
        Server.users[socket.id].team = team;
        Server.users[socket.id].ready = false;
        console.log(Server.users[socket.id].username + ' TEAM IS ' + Server.users[socket.id].team);
        if (Server.scene === Enum.Scene.MainMenu) {
            io.sockets.emit('REFRESH_USERS', {
                users: Server.users
            });
        }
    }
    
    function onUserReady() {
        Server.users[socket.id].ready = !Server.users[socket.id].ready;
        console.log(Server.users[socket.id].username + ' IS ' + (Server.users[socket.id].ready ? 'READY' : 'UNREADY'));
        if (Server.scene === Enum.Scene.MainMenu) {
            io.sockets.emit('REFRESH_USERS', {
                users: Server.users
            });
            
            if (Server.allUsersReady()) {
                Server.timer = 3;
                
                io.sockets.emit('SET_TIMER', {
                    timer: Server.timer
                });
                
                Server.interval = setInterval(function ()  {
                    Server.timer--;
                    
                    if (Server.timer <= 0) {
                        Server.timer = null;
                    }
                    
                    io.sockets.emit('SET_TIMER', {
                        timer: Server.timer
                    });
                    if (Server.timer <= 0) {
                        Server.startGame();                        
                        io.sockets.emit('START_GAME', {
                            map: Server.map,
                            scene: Server.scene,
                            users: Game[Server.game].players
                        });
                        clearInterval(Server.interval);
                    }
                }, 1000);
            } else {
                clearInterval(Server.interval);
                io.sockets.emit('SET_TIMER', {
                    timer: null
                });
            }
        }
    }
    
    function onSetPosition(data) {
        socket.broadcast.emit('POSITION_SENDED', {
            id: socket.id,
            position: data.position
        });
    }
    
    function onSetTracer(data) {
        socket.broadcast.emit('TRACE_SENDED', {
            id: socket.id,
            position: data.position
        });
    }
    
    function onSetFire(data) {
        socket.broadcast.emit('FIRE_SENDED', {
            id: socket.id,
            position: data.position
        });
    }
    
    function onSetTankTouch(data) {
        console.log(Server.users[data.id].username + ' IS TOUCHED');
        io.sockets.emit('TANK_TOUCHED', {
            id: data.id,
            hit: data.hit
        });
    }
    
    function onSetTankExplose() {
        console.log(Server.users[socket.id].username + ' IS KILLED');
        socket.broadcast.emit('TANK_EXPLOSED', {
            id: socket.id
        });
        
        Game[Server.game].players[socket.id].life--;
        if (Game[Server.game].players[socket.id].life <= 0) {
            Game[Server.game].removePlayer(socket.id);
            
            if (Game[Server.game].isEndGame()) {
                io.sockets.emit('END_GAME', {
                    winner: Game[Server.game].getWinner()
                });

                setTimeout(function () {
                    Game[Server.game].endGame();
                    Server.scene = Enum.Scene.MainMenu;
                    Server.setAllUsersUnready();
                    io.sockets.emit('RETURN_TO_MENU', {
                        users: Server.users,
                        scene: Server.scene
                    });
                }, 5000);
            }
        } else {
            setTimeout(function () {
                Game[Server.game].respawn(socket.id);
                socket.emit('RESPAWN', {
                    user: Game[Server.game].players[socket.id]
                });
                socket.broadcast.emit('TANK_RESPAWNED', {
                    user: Game[Server.game].players[socket.id]
                });
            }, 5000);
        }
    }
});

http.listen(3000, function () {
    Server.start();
    console.log('listening on *:3000');
});
