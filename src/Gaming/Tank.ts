
namespace src.Gaming {

    export abstract class Tank {

        public body: Phaser.Sprite;
        
        public turret: Phaser.Sprite;
        
        public shadow: Phaser.Sprite;
        
        public weapon: app.Gaming.Weapon;

        protected text: Phaser.Text;

        protected team: string;
                
        protected explosions: Phaser.Group;
                                
        public constructor(team: string, point: src.Map.Point) {            
            this.shadow = src.Game.get().add.sprite(point.getX(), point.getY(), 'tank-shadow');
            this.shadow.angle = point.getAngle();
            this.shadow.anchor.setTo(0.5, 0.5);
                        
            this.body = src.Game.get().add.sprite(point.getX(), point.getY(), 'tank-' + team);
            this.body.angle = point.getAngle();
            this.body.anchor.setTo(0.5, 0.5);
            
            this.body.data.team = team;
            this.body.data.speed = 0;
            this.body.data.health = 1;
            
            src.Game.get().physics.enable(this.body, Phaser.Physics.ARCADE);
            this.body.body.bounce.setTo(0, 0);
            this.body.body.collideWorldBounds = true;
            this.body.body.immovable = false;

            this.turret = src.Game.get().add.sprite(point.getX(), point.getY(), 'turret-' + team);
            this.turret.anchor.setTo(0.3, 0.5);

            this.weapon = new app.Gaming.Weapon(this, this.turret);
            
            this.explosions = src.Game.get().add.group();
            var explosionAnimation = this.explosions.create(0, 0, 'tank-explosion', 0, false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('tank-explosion');
        }
        
        public getHealth(): number {
            return this.body.data.health;
        }
        
        public setHealth(health: number): void {
            this.body.data.health = health;
        }
        
        public addHealth(health: number): void {
            this.body.data.health += health;
        }
        
        public removeHealth(health: number): void {
            this.body.data.health -= health;
            if (this.body.data.health < 0) {
                this.body.data.health = 0;
            }
        }
        
        public isAlive(): boolean {
            return this.body.data.health > 0;
        }
        
        public isDead(): boolean {
            return this.body.data.health <= 0;
        }

        public getWeapon(): src.Gaming.Weapon {
            return this.weapon;
        }
        
        public accelerate() {
            this.body.data.speed += 5;
            this.body.data.speed = this.body.data.speed > 100 ? 100 : this.body.data.speed;
            src.Game.get().physics.arcade.velocityFromRotation(this.body.rotation, this.body.data.speed, this.body.body.velocity);
            this.setTurretPosition();
            this.setShadowPosition();
        }

        public retreat() {
            this.body.data.speed -= 5;
            this.body.data.speed = this.body.data.speed < -100 ? -100 : this.body.data.speed;
            src.Game.get().physics.arcade.velocityFromRotation(this.body.rotation, this.body.data.speed, this.body.body.velocity);
            this.setTurretPosition();
            this.setShadowPosition();
        }

        public decelerate() {
            if (this.body.data.speed < 0) {
                this.body.data.speed += 3;
                this.body.data.speed = this.body.data.speed > 0 ? 0 : this.body.data.speed;
            } else {
                this.body.data.speed -= 3;
                this.body.data.speed = this.body.data.speed < 0 ? 0 : this.body.data.speed;
            }
            
            src.Game.get().physics.arcade.velocityFromRotation(this.body.rotation, this.body.data.speed, this.body.body.velocity);
            this.setTurretPosition();
            this.setShadowPosition();
        }

        public turnLeft() {
            this.body.angle -= 4;
            this.setTurretPosition();
            this.setShadowPosition();
        }

        public turnRight() {
            this.body.angle += 4;
            this.setTurretPosition();
            this.setShadowPosition();
        }

        public wrap() {
            src.Game.get().world.wrap(this.body, 16)
        }
        
        public explose(): void {
            this.body.kill();
            this.turret.kill();
            this.shadow.kill();
            var explosionAnimation = this.explosions.getFirstExists(false);
            explosionAnimation.reset(this.body.x, this.body.y);
            explosionAnimation.play('tank-explosion', 30, false, true);
        }
        
        public destroy(): void {
            this.body.destroy();
            this.turret.destroy();
        }

        public getTeam(): string {
            return this.team;
        }
        
        public isInMovement(): boolean {
            return this.body.data.speed !== 0;
        }
        
        public getPosition(): any {
            return {
                tank: {
                    x: this.body.x,
                    y: this.body.y,
                    angle: this.body.angle
                },
                turret: {
                    x: this.turret.x,
                    y: this.turret.y,
                    angle: this.turret.angle
                }
            };
        }
        
        private setTurretPosition(): void {
            this.turret.x = this.body.x;
            this.turret.y = this.body.y;
        }
        
        protected setShadowPosition(): void {
            this.shadow.x = this.body.x;
            this.shadow.y = this.body.y;
            this.shadow.angle = this.body.angle;
        }
    }

}
