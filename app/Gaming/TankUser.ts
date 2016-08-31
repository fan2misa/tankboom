
namespace app.Gaming {

    export class Tank extends src.Gaming.Tank {
        
        public static preload(): void {
            src.Game.get().load.spritesheet('tank-explosion', 'img/explosion/tank.png', 64, 64, 23);
            
            src.Game.get().load.spritesheet('tank-hit', 'img/tank/hit.png', 80, 80, 9);
            
            src.Game.get().load.spritesheet('tank-respawn', 'img/tank/respawn.png', 80, 80, 9);
            
            src.Game.get().load.image('tank-trace', 'img/tank/trace.png');
            src.Game.get().load.image('tank-shadow', 'img/tank/shadow.png');
            
            src.Game.get().load.image('tank-default', 'img/tank/default/tank.png');
            src.Game.get().load.image('turret-default', 'img/tank/default/turret.png');
            
            src.Game.get().load.image('tank-blue', 'img/tank/blue/tank.png');
            src.Game.get().load.image('turret-blue', 'img/tank/blue/turret.png');
            
            src.Game.get().load.image('tank-red', 'img/tank/red/tank.png');
            src.Game.get().load.image('turret-red', 'img/tank/red/turret.png');
            
            src.Game.get().load.image('tank-green', 'img/tank/green/tank.png');
            src.Game.get().load.image('turret-green', 'img/tank/green/turret.png');
            
            src.Game.get().load.image('tank-yellow', 'img/tank/yellow/tank.png');
            src.Game.get().load.image('turret-yellow', 'img/tank/yellow/turret.png');
        }
        
        public constructor(id: string, team: string, position: src.Map.Point) {
            super(team, position);
            this.body.data.id = id;
        }
        
        public setPosition(position: any): void {
            this.body.x = position.tank.x;
            this.body.y = position.tank.y;
            this.body.angle = position.tank.angle;
            this.turret.x = position.turret.x;
            this.turret.y = position.turret.y;
            this.turret.angle = position.turret.angle;
            this.setShadowPosition();
        }
    }
}
