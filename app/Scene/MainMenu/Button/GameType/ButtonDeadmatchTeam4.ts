
namespace app.Scene.MainMenu.Button.GameType {

    export class ButtonDeadmatchTeam4 extends src.Scene.Button {

        public static preload(): void {
            src.Game.get().load.image('button-deadmatchteam4-deactivate', 'img/button/deadmatchteam4/button-deactivate.png');
            src.Game.get().load.image('button-deadmatchteam4-activate', 'img/button/deadmatchteam4/button-activate.png');
        }

        public constructor() {
            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
            var y = 120 + src.Parameter.get('margin');
            super('button-deadmatchteam4-deactivate', 'button-deadmatchteam4-activate', x, y);
            this.setAnchor(1, 0);
            this.onClick(this.handleAction);
        }

        private handleAction(): void {
            app.Socket.setGameType(Enum.GameTypeEnum.DEADMATCHTEAM4);
        }
    }

}
