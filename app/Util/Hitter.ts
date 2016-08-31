
namespace app.Util {
    
    export class Hitter {
        
        private hitGroup: Phaser.Group;
        
        public constructor() {
            this.hitGroup = src.Game.get().add.group();
            
            var explosionAnimation = this.hitGroup.create(0, 0, 'tank-hit', 0, false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('tank-hit');
        }
        
        public play(position: any) {
            var explosionAnimation = this.hitGroup.getFirstExists(false, true);
            explosionAnimation.reset(position.tank.x, position.tank.y);
            explosionAnimation.play('tank-hit', 30, false, true);
        }
        
    }
    
}