
namespace app.Scene.MainMenu.Panel {
    
    export class TeamRedPanel extends src.Scene.Panel {
        
        public constructor(x: number, y: number, width: number, height: number) {
            super(x, y, width, height);
            this.blockRender(0xc0392b);
            this.onClick(this.handleAction);
        }
        
        private handleAction(): void {
            if (!app.User.isReady()) {
                app.Socket.setUserTeam(Enum.TeamEnum.RED);
            }
        }
        
    }
    
}