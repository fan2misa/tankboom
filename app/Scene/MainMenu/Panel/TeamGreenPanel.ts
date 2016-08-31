
namespace app.Scene.MainMenu.Panel {
    
    export class TeamGreenPanel extends src.Scene.Panel {
        
        public constructor(x: number, y: number, width: number, height: number) {
            super(x, y, width, height);
            this.blockRender(0x27ae60);
            this.onClick(this.handleAction);
        }
        
        private handleAction(): void {
            if (!app.User.isReady()) {
                app.Socket.setUserTeam(Enum.TeamEnum.GREEN);
            }
        }
        
    }
    
}