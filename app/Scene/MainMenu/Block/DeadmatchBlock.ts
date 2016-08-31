
namespace app.Scene.MainMenu.Block {
    
    export class DeadmatchBlock extends app.Scene.MainMenu.Block.Block {
        
        private panel: src.Scene.Panel;
        
        public constructor() {
            super();
            this.panel = new app.Scene.MainMenu.Panel.TeamDefaultPanel(0, 0, 100, 100);
        }
        
        public displayUsers(): void {
            this.removeAllUsers();
            for (var i in app.Server.getUsers()) {
                this.panel.addPlayer(app.Server.getUsers()[i]);
            }
        }
        
        public removeAllUsers(): void {
            this.panel.removeAllPlayers();
        }
        
        public destroy() {
            this.panel.destroy();
        }
    }
    
}