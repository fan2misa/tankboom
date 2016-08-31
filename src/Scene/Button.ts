
namespace src.Scene {
    
    export abstract class Button {
                
        private phaserButton: Phaser.Button;
                
        private active: boolean = false;
        
        private textureDeactivate: string;
        
        private textureActivate: string;
        
        public constructor(textureDeactivate: string, textureActivate: string, x: number, y: number) {
            this.textureActivate = textureActivate;
            this.textureDeactivate = textureDeactivate;
            this.phaserButton = src.Game.get().add.button(x, y, this.textureDeactivate);
        }
        
        public deactivate(): void {
            this.phaserButton.loadTexture(this.textureDeactivate);
            this.active = false;
        }
        
        public activate(): void {
            this.phaserButton.loadTexture(this.textureActivate);
            this.active = true;
        }
        
        public toogleActivation(): void {
            this.active ? this.deactivate() : this.activate();
        }
        
        public getX(): number {
            return this.phaserButton.x;
        }
        
        public getY(): number {
            return this.phaserButton.y;
        }
        
        public getWidth(): number {
            return this.phaserButton.width;
        }
        
        protected onClick(callback: Function) {
            this.phaserButton.events.onInputDown.add(callback, this);
        }
        
        public destroy(): void {
            this.phaserButton.destroy();
        }
        
        protected setAnchor(x: number, y: number): void {
            this.phaserButton.anchor.set(x, y);
        }
    }
    
}
