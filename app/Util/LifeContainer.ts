
namespace app.Util {

    export class LifeContainer {

        private tank: src.Gaming.Tank;

        private width: number = 200;
        
        private height: number = 25;
        
        private heightMax: number;
        
        private healtGraphic: Phaser.Graphics;
        
        private lifeText: Phaser.Text;

        public constructor(tank: src.Gaming.Tank) {
            this.tank = tank;
            this.heightMax = this.tank.getHealth();
            this.lifeContainer();
            
            this.healtGraphic = src.Game.get().add.graphics(10, 10);
            this.healtGraphic.fixedToCamera = true;
            this.healtGraphic.cameraOffset.setTo(10, 10);
            
            this.lifeText = src.Game.get().add.text(10, 45, 'Vie: ', {font: "18px Arial", fill: "#ffffff"});
            this.lifeText.fixedToCamera = true;
            this.lifeText.cameraOffset.setTo(10, 45);
        }
        
        public refresh(): void {
            this.healtGraphic.clear();

            this.healtGraphic.beginFill(this.getLifeColor(), 0.5);

            this.healtGraphic.moveTo(1, 1);
            this.healtGraphic.lineTo(this.getLifeWidth() - 1, 1);
            this.healtGraphic.lineTo(this.getLifeWidth() - 1, this.height - 1);
            this.healtGraphic.lineTo(1, this.height - 1);
            this.healtGraphic.lineTo(1, 1);
            
            this.lifeText.setText('Vie: ' + (app.User.getLife() - 1));
        }
        
        public setTank(tank: src.Gaming.Tank): void {
            this.tank = tank;
        }
        
        private lifeContainer(): void {
            var graphics = src.Game.get().add.graphics(10, 10);
            graphics.clear();

            graphics.lineStyle(1, 0xffffff, 0.8);

            graphics.moveTo(0, 0);
            graphics.lineTo(this.width, 0);
            graphics.lineTo(this.width, this.height);
            graphics.lineTo(0, this.height);
            graphics.lineTo(0, 0);
            
            graphics.fixedToCamera = true;
            graphics.cameraOffset.setTo(10, 10);
        }
        
        private getLifeWidth(): number {
            return (this.width * this.tank.getHealth()) / this.heightMax;
        }

        private getLifeColor(): any {
            var color = 0x27ae60;
            if (this.tank.getHealth() <= (this.heightMax / 3)) {
                color = 0xe74c3c;
            } else if (this.tank.getHealth() <= (this.heightMax / 2)) {
                color = 0xe67e22;
            }
            return color;
        }
    }

}
