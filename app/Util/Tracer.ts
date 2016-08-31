
namespace app.Util {
    
    export class Tracer {
                
        private traceGroup: Phaser.Group;
        
        private traceRate: number;
        
        private i: number;
        
        public constructor() {
            this.traceGroup = src.Game.get().add.group();
            this.traceRate = 20;
            this.i = 0;
        }
        
        public set(position: any): void {
            var trace = src.Game.get().make.sprite(position.tank.x, position.tank.y, 'tank-trace');
            trace.anchor.set(0.5, 0.5);
            trace.angle = position.tank.angle;
            this.traceGroup.add(trace);
        }
        
        public generate(position: any, callback: () => void): void {
            if (this.i >= this.traceRate) {
                this.i = 0;
                this.set(position);
                callback();
            }
            this.i++;
        }
    }
}