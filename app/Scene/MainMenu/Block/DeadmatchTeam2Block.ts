
namespace app.Scene.MainMenu.Block {
    
    export class DeadmatchTeam2Block extends app.Scene.MainMenu.Block.Block {
        
        private panelBlue: src.Scene.Panel;
        
        private panelRed: src.Scene.Panel;
        
        public constructor() {
            super();
            this.panelBlue = new app.Scene.MainMenu.Panel.TeamBluePanel(0, 0, 50, 100);
            this.panelRed = new app.Scene.MainMenu.Panel.TeamRedPanel(50, 0, 50, 100);
        }
        
        public displayUsers(): void {
            this.removeAllUsers();
            for (var i in app.Server.getUsers()) {
                switch (app.Server.getUsers()[i].team) {
                    case Enum.TeamEnum.BLUE: this.panelBlue.addPlayer(app.Server.getUsers()[i]); break;
                    case Enum.TeamEnum.RED: this.panelRed.addPlayer(app.Server.getUsers()[i]); break;
                }
            }
        }
        
        public removeAllUsers(): void {
            this.panelBlue.removeAllPlayers();
            this.panelRed.removeAllPlayers();
        }
        
        public destroy() {
            this.panelBlue.destroy();
            this.panelRed.destroy();
        }
    }
    
}