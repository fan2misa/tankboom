
namespace app.Scene.MainMenu.Button.GameType {

    export class ButtonDeadmatch extends src.Scene.Button {
                
        public static preload(): void {
            src.Game.get().load.image('button-deadmatch-deactivate', 'img/button/deadmatch/button-deactivate.png');
            src.Game.get().load.image('button-deadmatch-activate', 'img/button/deadmatch/button-activate.png');
        }
        
        public constructor() {
            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
            var y = 0 + src.Parameter.get('margin');
            super('button-deadmatch-deactivate', 'button-deadmatch-activate', x, y);
            this.setAnchor(1, 0);
            this.onClick(this.handleAction);
        }
        
        private handleAction(): void {
            app.Socket.setGameType(Enum.GameTypeEnum.DEADMATCH);
        }
    }

}
