/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace src.Gaming {

    export abstract class Weapon {

        private tank: src.Gaming.Tank;

        public bullets: Phaser.Group;

        private fireRate: number;

        private nextFire: number;

        private bulletSpeed: number;

        private turret: Phaser.Sprite;

        public constructor(tank: src.Gaming.Tank, turret: Phaser.Sprite, fireRate: number, bulletSpeed: number) {
            this.tank = tank;
            this.nextFire = 0;
            this.fireRate = fireRate;
            this.bulletSpeed = bulletSpeed;
            this.turret = turret;
            this.bullets = src.Game.get().add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(5, 'bullet');
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('body.bounce.x', 1);
            this.bullets.setAll('body.bounce.y', 1);
        }

        public getBullets() {
            return this.bullets;
        }

        public fire(callback: () => void) {
            if (src.Game.get().time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = src.Game.get().time.now + this.fireRate;
                var bullet = this.createBullet();
                
                bullet.rotation = src.Game.get().physics.arcade.moveToPointer(
                    bullet,
                    this.bulletSpeed,
                    src.Game.get().input.activePointer
                );

                callback();
            }
        }

        public fireToXY(position: any) {
            var bullet = this.createBullet();
            bullet.rotation = src.Game.get().physics.arcade.moveToXY(bullet, position.x, position.y, this.bulletSpeed);
        }

        private createBullet(): Phaser.Bullet {
            var bullet: Phaser.Bullet = this.bullets.getFirstExists(false, true);

            bullet.reset(this.turret.x, this.turret.y);
            bullet.data.speed = this.bulletSpeed;
            bullet.body.bounce.x = 1;
            bullet.body.bounce.y = 1;
            bullet.data.hit = 1;
            bullet.data.bounce = 1;

            return bullet;
        }
    }

}
