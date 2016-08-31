
namespace src.Scene {
    
    export class SceneManager {
        
        private static scenes: Array<src.Scene.Scene>;
        
        public static scene: src.Scene.Scene;
        
        public static init(): void {
            this.scenes = new Array();
            
            this.scenes[app.Enum.SceneEnum.WAIT] = new app.Scene.MainMenu.WaitScene();
            this.scenes[app.Enum.SceneEnum.WAIT].init();
            
            this.scenes[app.Enum.SceneEnum.MAINMENU] = new app.Scene.MainMenu.MainMenuScene();
            this.scenes[app.Enum.SceneEnum.MAINMENU].init();
            
            this.scenes[app.Enum.SceneEnum.INGAME] = new app.Scene.InGame.InGameScene();
            this.scenes[app.Enum.SceneEnum.INGAME].init();
        }
        
        public static start(): void {
            if (undefined !== this.scene) {
                src.Game.get().world.removeAll();
                src.Game.get().camera.setPosition(0, 0);
            }
            this.scene = this.scenes[app.Server.getScene()];
            this.scene.start();
        }
    }
    
}