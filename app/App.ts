
namespace app {

    export class App {

        public constructor() {
            src.Parameter.init();
            src.Game.run(src.Parameter.get('sceneWidth'), src.Parameter.get('sceneHeight'), {
                preload: this.preload,
                create: this.create,
                update: this.update,
                render: this.render
            });
        }

        public preload(): void {
            app.Scene.MainMenu.MainMenuScene.preload();
            src.Map.Map.preload();
            app.Gaming.Tank.preload();
            app.Gaming.Weapon.preload();
        }

        public create(): void {
            src.Scene.SceneManager.init();
            if (app.Server.getScene() !== app.Enum.SceneEnum.INGAME) {
                src.Scene.SceneManager.start();
            } else {
                
            }
        }

        public update(): void {
            src.Scene.SceneManager.scene.update();
        }
        
        public render(): void {
            src.Scene.SceneManager.scene.render();
        }

    }

}
