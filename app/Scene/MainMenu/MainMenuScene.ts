
namespace app.Scene.MainMenu {
    
    export class MainMenuScene extends src.Scene.Scene {
        
        private block: app.Scene.MainMenu.Block.Block;
        
        private buttonsGame: Array<src.Scene.Button>;
        
        private buttonReady: app.Scene.MainMenu.Button.ButtonReady;
        
        private infoText: Phaser.Text;
        
        private logo: Phaser.Sprite;
        
        public constructor() {
            super();
            this.buttonsGame = new Array();
        }
        
        public static preload(): void {
            src.Game.get().load.image('logo', 'img/logo.png');
            app.Scene.MainMenu.Button.ButtonReady.preload();
            app.Scene.MainMenu.Button.GameType.ButtonDeadmatch.preload();
            app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam2.preload();
            app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam4.preload();
            app.Scene.MainMenu.Button.GameType.ButtonCaptureFlag.preload();
        }
        
        public init(): void {
            var me = this;
            
            app.Socket.onRefreshUsers((): void => {
                me.block.displayUsers();
            });
            
            app.Socket.onGameTypeChanged((): void => {
                me.activeButtonGameType();
                me.block.displayUsers();
                me.buttonReady.deactivate();
            });
            
            app.Socket.onTimer((): void => {
                this.setMiddleText(null !== app.Server.getTimer() ? app.Server.getTimer().toString() : '');
            });
            
            app.Socket.onStartGame((): void => {
                src.Scene.SceneManager.start();
            });
        }
        
        public start(): void {
            this.logo = src.Game.get().add.sprite(src.Game.get().world.centerX - 125, src.Game.get().world.centerY, 'logo');
            this.logo.anchor.set(0.5, 0.5);
            
            src.Game.get().world.setBounds(0, 0, src.Parameter.get('sceneWidth'), src.Parameter.get('sceneHeight'));
            
            this.generateButtonsGameType();
            this.activeButtonGameType();
            
            this.buttonReady = new app.Scene.MainMenu.Button.ButtonReady();
            
            this.block.displayUsers();
            
            this.generateMiddleText();
        }
        
        public update(): void {
            
        }
        
        public render(): void {
            
        }
        
        private generateButtonsGameType(): void {
            this.generateButtonDeadmatch();
            this.generateButtonDeadmatchteam2();
            this.generateButtonDeadmatchteam4();
//            this.generateButtonCaptureFlag();
        }
        
        private generateButtonDeadmatch(): void {
            this.buttonsGame[app.Enum.GameTypeEnum.DEADMATCH]
                = new app.Scene.MainMenu.Button.GameType.ButtonDeadmatch();
        }
        
        private generateButtonDeadmatchteam2(): void {
            this.buttonsGame[app.Enum.GameTypeEnum.DEADMATCHTEAM2]
                = new app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam2();
        }
        
        private generateButtonDeadmatchteam4(): void {
            this.buttonsGame[app.Enum.GameTypeEnum.DEADMATCHTEAM4]
                = new app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam4();
        }
        
        private generateButtonCaptureFlag(): void {
            this.buttonsGame[app.Enum.GameTypeEnum.CAPTUREFLAG]
                = new app.Scene.MainMenu.Button.GameType.ButtonCaptureFlag();
        }
        
        private activeButtonGameType(): void {
            for (var i in this.buttonsGame) {
                this.buttonsGame[i].deactivate();
            }
            this.buttonsGame[app.Server.getGame()].activate();
            this.startBlock();
        }
        
        private startBlock(): void {
            if (this.block) {
                this.block.destroy();
            }
            
            switch (app.Server.getGame()) {
                case Enum.GameTypeEnum.DEADMATCH: this.block = new app.Scene.MainMenu.Block.DeadmatchBlock(); break;
                case Enum.GameTypeEnum.DEADMATCHTEAM2: this.block = new app.Scene.MainMenu.Block.DeadmatchTeam2Block(); break;
                case Enum.GameTypeEnum.DEADMATCHTEAM4: this.block = new app.Scene.MainMenu.Block.DeadmatchTeam4Block(); break;
                case Enum.GameTypeEnum.CAPTUREFLAG: this.block = new app.Scene.MainMenu.Block.CaptureFlagBlock(); break;
            }
        }
        
        private generateMiddleText(): void {
            var lastButtonGame = this.buttonsGame[Object.keys(this.buttonsGame)[Object.keys(this.buttonsGame).length - 1]];
            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin') - (lastButtonGame.getWidth() / 2);
            this.infoText = src.Game.get().add.text(x, lastButtonGame.getY() + ((this.buttonReady.getY() - lastButtonGame.getY()) / 2), '', {
                font: "72px Arial", 
                fill: "#ffffff",
                boundsAlignH: "center",
                boundsAlignV: "middle"
            });
            this.infoText.anchor.set(0.5, 0.5);
        }
        
        private setMiddleText(text: string): void {
            this.infoText.setText(text);
        }
    }

}
