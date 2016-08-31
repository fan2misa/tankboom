/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace app.Gaming {

    export class Weapon extends src.Gaming.Weapon {
        
        public static preload(): void {
            src.Game.get().load.spritesheet('bullet-explosion', 'img/explosion/bullet.png', 32, 32, 23);
            
            src.Game.get().load.image('bullet', 'img/tank/bullet2.png');
        }
        
        public constructor(tank: src.Gaming.Tank, turret: Phaser.Sprite) {
            super(tank, turret, 1000, 400);
        }
        
    }

}
