
namespace app.Scene.MainMenu {
    
    export class WaitScene extends src.Scene.Scene {

        private infoText: Phaser.Text;
        
        private infoText2: Phaser.Text;
        
        private point: number;
        
        private time: number;
        
        public init(): void {
            this.time = 0;
            this.point = 0;
        }
        
        public start(): void {
            this.infoText = src.Game.get().add.text(src.Game.get().world.centerX, src.Game.get().world.centerY, 'Une partie est en cours, veuillez patienter', {
                font: "24px Arial", 
                fill: "#ffffff"
            });
            this.infoText.anchor.set(0.5, 0.5);
            
            this.infoText2 = src.Game.get().add.text(src.Game.get().world.centerX, src.Game.get().world.centerY + 20, this.getPoint(), {
                font: "24px Arial", 
                fill: "#ffffff"
            });
            this.infoText.anchor.set(0.5, 0.5);
        }
        
        public update(): void {
            
        }
        
        public render(): void {
            if (src.Game.get().time.now > this.time) {
                this.time = src.Game.get().time.now + 1000;
                this.point++;
                if (this.point > 3) {
                    this.point = 0;
                }
                this.infoText2.setText(this.getPoint());
            }
        }
        
        private getPoint(): string {
            var text = '';
            for (var i = 0; i < this.point; i++) {
                text += '.';
            }
            return text;
        }
    }

}
