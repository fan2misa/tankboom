
namespace app.Scene.MainMenu.Button.GameType {

    export class ButtonDeadmatchTeam2 extends src.Scene.Button {

        public static preload(): void {
            src.Game.get().load.image('button-deadmatchteam2-deactivate', 'img/button/deadmatchteam2/button-deactivate.png');
            src.Game.get().load.image('button-deadmatchteam2-activate', 'img/button/deadmatchteam2/button-activate.png');
        }

        public constructor() {
            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
            var y = 60 + src.Parameter.get('margin');
            super('button-deadmatchteam2-deactivate', 'button-deadmatchteam2-activate', x, y);
            this.setAnchor(1, 0);
            this.onClick(this.handleAction);
        }

        private handleAction(): void {
            app.Socket.setGameType(Enum.GameTypeEnum.DEADMATCHTEAM2);
        }
    }

}
