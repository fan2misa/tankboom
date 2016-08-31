
namespace app.Scene.MainMenu.Button {

    export class ButtonReady extends src.Scene.Button {

        public static preload(): void {
            src.Game.get().load.image('button-ready-deactivate', 'img/button/ready/button-deactivate.png');
            src.Game.get().load.image('button-ready-activate', 'img/button/ready/button-activate.png');
        }

        public constructor() {
            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
            var y = src.Parameter.get('sceneHeight') - src.Parameter.get('margin');
            super('button-ready-deactivate', 'button-ready-activate', x, y);
            this.setAnchor(1, 1);
            this.onClick(this.handleAction);
        }

        private handleAction(): void {
            this.toogleActivation();
            app.User.setReady(!app.Server.getUser().ready);
            app.Socket.setUserReady();
        }

    }

}
