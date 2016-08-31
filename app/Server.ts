
namespace app {

    export abstract class Server {
        
        protected static data: any;
        
        public static start(): void {
            this.data = {};
        }
        
        public static getUser(): any {
            return this.data.user;
        }
        
        public static getUsers(): any {
            return this.data.users;
        }
        
        public static getScene(): any {
            return this.data.scene;
        }
        
        public static getGame(): any {
            return this.data.game;
        }
        
        public static getNewUser(): any {
            return this.data.newUser;
        }
        
        public static getDisconnectedUser(): any {
            return this.data.disconnectedUser;
        }
        
        public static getTimer(): number {
            return this.data.timer;
        }
        
        public static getMap(): string {
            return this.data.map;
        }
        
        public static setData(data: any) {
            var updateUser = true;
            for (var i in data) {
                if (i === 'user') {
                    updateUser = false;
                }
                this.data[i] = data[i];
            }
            
            if (updateUser) {
                this.data.user = this.data.users[app.User.getId()];
            }
        }
    }
}
