
namespace app.Scene.MainMenu.Button.GameType {

    export class ButtonCaptureFlag extends src.Scene.Button {
                
        public static preload(): void {
            src.Game.get().load.image('button-captureflag-deactivate', 'img/button/captureflag/button-deactivate.png');
            src.Game.get().load.image('button-captureflag-activate', 'img/button/captureflag/button-activate.png');
        }
        
        public constructor() {
            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
            var y = 180 + src.Parameter.get('margin');
            super('button-captureflag-deactivate', 'button-captureflag-activate', x, y);
            this.setAnchor(1, 0);
            this.onClick(this.handleAction);
        }
        
        private handleAction(): void {
            app.Socket.setGameType(Enum.GameTypeEnum.CAPTUREFLAG);
        }
    }

}
