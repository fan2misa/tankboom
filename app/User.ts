
namespace app {

    export class User {
        
        public static getId(): string {
            return app.Server.getUser().id;
        }
        
        public static getUsername(): string {
            return app.Server.getUser().username;
        }
        
        public static getTeam(): string {
            return app.Server.getUser().team;
        }
        
        public static getHealt(): number {
            return app.Server.getUser().healt;
        }
        
        public static getLife(): number {
            return app.Server.getUser().life;
        }
        
        public static setReady(ready: boolean): void {
            app.Server.getUser().ready = ready;
        }
        
        public static isReady(): boolean {
            return app.Server.getUser().ready;
        }
        
        public static getPosition(): string {
            return app.Server.getUser().position;
        }
    }

}
