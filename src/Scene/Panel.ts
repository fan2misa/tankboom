
namespace src.Scene {

    export abstract class Panel {

        protected phaserGraphics: Phaser.Graphics;

        protected x: number;
        
        protected y: number;
        
        protected width: number;
        
        protected height: number;

        protected users: Array<any>;
        
        protected readys: Array<any>;

        public constructor(x: number, y: number, width: number, height: number) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.phaserGraphics = src.Game.get().add.graphics(this.getX(), this.getY());
            this.users = new Array();
            this.readys = new Array();
        }

        public addPlayer(player: any) {
            var y = (30 * this.users.length) + 10;
                        
            var text = src.Game.get().add.text(this.phaserGraphics.x + this.getHalfMargin() + 10, this.phaserGraphics.y + this.getHalfMargin() + y, player.username, {
                font: "16px Arial", 
                fill: "#ffffff"
            });
            this.users.push(text);
            
            if (player.ready) {
                var ready = src.Game.get().add.text(this.phaserGraphics.x + this.getWidth() - this.getHalfMargin() - 10, this.phaserGraphics.y + this.getHalfMargin() + y, "PRET", {
                    font: "16px Arial", 
                    fill: "#27ae60"
                });
                ready.anchor.set(1, 0);
                this.readys.push(ready);
            }
        }

        protected blockRender(color: number): void {
            this.phaserGraphics.clear();
            this.phaserGraphics.beginFill(0x333333, 0.5);
            this.phaserGraphics.lineStyle(1, color, 1);
            this.phaserGraphics.moveTo(this.getHalfMargin(), this.getHalfMargin());
            this.phaserGraphics.lineTo(this.getWidth() - this.getHalfMargin(), this.getHalfMargin());
            this.phaserGraphics.lineTo(this.getWidth() - this.getHalfMargin(), this.getHeight() - this.getHalfMargin());
            this.phaserGraphics.lineTo(this.getHalfMargin(), this.getHeight() - this.getHalfMargin());
            this.phaserGraphics.lineTo(this.getHalfMargin(), this.getHalfMargin());
            this.phaserGraphics.endFill();
        }
        
        public removeAllPlayers(): void {
            this.users.forEach(function (item) {
                item.destroy();
            });
            this.readys.forEach(function (item) {
                item.destroy();
            });
            this.users = new Array();
            this.readys = new Array();
        }
        
        protected onClick(callback: Function) {
            this.phaserGraphics.inputEnabled = true;
            this.phaserGraphics.events.onInputDown.add(callback, this);
        }

        protected getX(): number {
            return ((this.x * this.getFullWidth()) / 100) + this.getHalfMargin();
        }
        
        protected getY(): number {
            return (this.y * this.getFullHeight()) / 100 + this.getHalfMargin();
        }

        protected getWidth(): number {
            return (this.width * this.getFullWidth()) / 100;
        }
        
        protected getHeight(): number {
            return (this.height * this.getFullHeight()) / 100;
        }
        
        protected getFullWidth(): number {
            return src.Parameter.get('sceneWidth') - this.getMargin() - 250;
        }
        
        protected getFullHeight(): number {
            return src.Parameter.get('sceneHeight') - this.getMargin();
        }
        
        protected getHalfMargin(): number {
            return src.Parameter.get('margin') / 2;
        }
        
        protected getMargin(): number {
            return src.Parameter.get('margin');
        }
        
        public destroy(): void {
            this.removeAllPlayers();
            this.phaserGraphics.destroy();
        }
    }

}
