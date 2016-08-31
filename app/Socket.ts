
namespace app {

    export abstract class Socket {

        protected static instance: any;

        public static start() {
            this.instance = io();
        }

        public static connection(): void {
            var username = 'Anonyme';
            if (username = prompt("Votre nom", username)) {
                this.instance.emit('USER_CONNECT', username);
            }
        }
        
        public static onConnection(callback: () => void): void {
            this.instance.on('USER_CONNECT_SUCCESS', (data: any) => {
                Server.setData(data);
                callback();
            });
        }
        
        public static onTimer(callback: () => void): void {
            this.instance.on('SET_TIMER', (data: any) => {
                Server.setData(data);
                callback();
            });
        }
        
        public static setUserReady(): void {
            this.instance.emit('USER_READY');
        }
        
        public static setGameType(gameType: string): void {
            this.instance.emit('CHANGE_GAME_TYPE', gameType);
        }
        
        public static setUserTeam(team: string): void {
            this.instance.emit('USER_CHANGE_TEAM', team);
        }
        
        public static onGameTypeChanged(callback: () => void): void {
            this.instance.on('GAME_TYPE_CHANGED', (data: any) => {
                Server.setData(data);
                callback();
            });
        }
        
        public static onRefreshUsers(callback: () => void): void {
            this.instance.on('REFRESH_USERS', (data: any) => {
                Server.setData(data);
                callback();
            });
        }
        
        public static onStartGame(callback: () => void): void {
            this.instance.on('START_GAME', (data: any) => {
                Server.setData(data);
                callback();
            });
        }
        
        public static setPosition(tank: app.Gaming.Tank): void {
            this.instance.emit('SET_POSITION', {
                position: tank.getPosition()
            });
        }
        
        public static onPositionSended(callback: (user: any) => void): void {
            this.instance.on('POSITION_SENDED', (data: any) => {
                callback(data);
            });
        }
        
        public static setTracer(tank: app.Gaming.Tank): void {
            this.instance.emit('SET_TRACER', {
                position: tank.getPosition()
            });
        }
        
        public static onTraceSended(callback: (user: any) => void): void {
            this.instance.on('TRACE_SENDED', (data: any) => {
                callback(data);
            });
        }
        
        public static setFire(tank: app.Gaming.Tank): void {
            this.instance.emit('SET_FIRE', {
                position: {
                    x: src.Game.get().input.mousePointer.x,
                    y: src.Game.get().input.mousePointer.y
                }
            });
        }
        
        public static onFireSended(callback: (user: any) => void): void {
            this.instance.on('FIRE_SENDED', (data: any) => {
                callback(data);
            });
        }
        
        public static setTankTouch(id: string, hit: number): void {
            this.instance.emit('SET_TANK_TOUCH', {
                id: id,
                hit: hit
            });
        }
        
        public static onTankTouched(callback: (user: any, hit: number) => void): void {
            this.instance.on('TANK_TOUCHED', (data: any) => {
                callback({id: data.id}, data.hit);
            });
        }
        
        public static setTankExplose(): void {
            this.instance.emit('SET_TANK_EXPLOSE');
        }
        
        public static onTankExplosed(callback: (user: any) => void): void {
            this.instance.on('TANK_EXPLOSED', (data: any) => {
                callback(data);
            });
        }
        
        public static onRespawn(callback: () => void): void {
            this.instance.on('RESPAWN', (data: any) => {
                Server.setData(data);
                callback();
            });
        }
        
        public static onTankRespawned(callback: (user: any) => void): void {
            this.instance.on('TANK_RESPAWNED', (data: any) => {
                callback(data.user);
            });
        }
        
        public static onEndGame(callback: (user: any) => void): void {
            this.instance.on('END_GAME', (data: any) => {
                callback(data.winner);
            });
        }
        
        public static onReturnToMenu(callback: () => void): void {
            this.instance.on('RETURN_TO_MENU', (data: any) => {
                Server.setData(data);
                callback();
            });
        }
    }
}
