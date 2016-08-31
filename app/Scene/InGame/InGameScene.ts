
namespace app.Scene.InGame {
    
    export class InGameScene extends src.Scene.Scene {
        
        protected command: app.Command.Command;
        
        protected tank: app.Gaming.Tank;
        
        protected tanks: Array<app.Gaming.Tank>;
        
        protected message: Phaser.Text;
        
        private lifeContainer: app.Util.LifeContainer;
        
        private tracer: app.Util.Tracer;
        
        private hitter: app.Util.Hitter;
                
        private tankGroup: Phaser.Group;
        
        public constructor() {
            super();
            this.tanks = new Array();
        }
        
        public init(): void {
            var me = this;
            app.Socket.onPositionSended((user) => {
                me.tanks[user.id].setPosition(user.position);
            });
            
            app.Socket.onTraceSended((user) => {
                me.tracer.set(me.tanks[user.id].getPosition());
            });
            
            app.Socket.onFireSended((user) => {
                me.tanks[user.id].getWeapon().fireToXY(user.position);
            });
            
            app.Socket.onTankTouched((user, hit) => {
                if (user.id === app.User.getId()) {
                    me.tank.removeHealth(hit);
                    if (me.tank.isDead()) {
                        me.tank.explose();
                        app.Socket.setTankExplose();
                    }
                }
            });
            
            app.Socket.onTankExplosed((user: any) => {
                me.tanks[user.id].explose();
            });
            
            app.Socket.onRespawn(() => {
                me.tank = new app.Gaming.Tank(app.User.getId(), app.User.getTeam(), new src.Map.Point(app.User.getPosition()));
                me.tank.setHealth(app.User.getHealt());
                me.addTankToGroup(me.tank);
                me.lifeContainer.setTank(me.tank);     
            });
            
            app.Socket.onTankRespawned((user) => {
                me.tanks[user.id] = new app.Gaming.Tank(user.id, user.team, new src.Map.Point(user.position));
                me.tanks[user.id].setHealth(user.healt);
                me.addTankToGroup(me.tanks[user.id]);
            });
            
            app.Socket.onEndGame((winner: any) => {
                if (app.Server.getScene() === app.Enum.SceneEnum.INGAME) {
                    me.setMessage("Victoire de " + winner);
                }
            });
            
            app.Socket.onReturnToMenu(() => {
                src.Scene.SceneManager.start();
            });
        }

        public start(): void {
            src.Map.Map.init(app.Server.getMap());
            this.command = new app.Command.Command();
            this.tracer = new app.Util.Tracer();
            this.hitter = new app.Util.Hitter();
            
            this.tankGroup = src.Game.get().add.group();

            this.tank = new app.Gaming.Tank(app.User.getId(), app.User.getTeam(), new src.Map.Point(app.User.getPosition()));
            this.tank.setHealth(app.User.getHealt());
            this.addTankToGroup(this.tank);

            for (var i in app.Server.getUsers()) {
                if (app.Server.getUsers()[i].id !== app.User.getId()) {
                    var user = app.Server.getUsers()[i];
                    this.tanks[user.id] = new app.Gaming.Tank(user.id, user.team, new src.Map.Point(user.position));
                    this.tanks[user.id].setHealth(user.healt);
                    this.addTankToGroup(this.tanks[user.id]);
                }
            }
            
            this.lifeContainer = new app.Util.LifeContainer(this.tank);
        }
        
        public update(): void {
            src.Game.get().physics.arcade.collide(this.tank.body, src.Map.Map.getWall());
            src.Game.get().physics.arcade.collide(this.tank.getWeapon().getBullets(), src.Map.Map.getWall(), this.collideMapCallback, null, this);
            
            src.Game.get().physics.arcade.collide(this.tankGroup);
            src.Game.get().physics.arcade.overlap(this.tank.getWeapon().getBullets(), this.tankGroup, this.overlapTankCallback, null, this);
            
            for (var i in this.tanks) {
                src.Game.get().physics.arcade.collide(this.tanks[i].getWeapon().getBullets(), src.Map.Map.getWall(), this.collideMapCallback, null, this);
                src.Game.get().physics.arcade.collide(this.tanks[i].getWeapon().getBullets(), this.tankGroup, this.collideTankCallback, null, this);
            }
                        
            this.tank.turret.rotation = src.Game.get().physics.arcade.angleToPointer(this.tank.turret);
                        
            if (this.tank.isAlive()) {
                if (this.command.up()) {
                    this.tank.accelerate();
                } else if (this.command.down()) {
                    this.tank.retreat();
                } else {
                    this.tank.decelerate();
                }

                if (this.command.left()) {
                    this.tank.turnLeft();
                } else if (this.command.right()) {
                    this.tank.turnRight();
                }

                if (this.command.leftClick()) {
                    this.tank.getWeapon().fire(() => {
                        app.Socket.setFire(this.tank);
                    });
                }
                
                if (this.tank.isInMovement()) {
                    this.tracer.generate(this.tank.getPosition(), () => {
                        app.Socket.setTracer(this.tank);
                    });
                }
                
                app.Socket.setPosition(this.tank);
            }
        }
                
        public render(): void {
            this.lifeContainer.refresh();
        }
        
        private setMessage(text: string): void {
            if (undefined !== this.message) {
                this.message.destroy();
            }

            this.message = src.Game.get().add.text(0, 0, text, {
                font: "72px Arial", 
                fill: "#ffffff"
            });
            this.message.fixedToCamera = true;
            this.message.cameraOffset.setTo(src.Parameter.get('sceneWidth') / 2, src.Parameter.get('sceneHeight') / 2);
            this.message.anchor.set(0.5, 0.5);
        }
        
        private isSameTeam(team1: string, team2: string): boolean {
            return !(team1 === Enum.TeamEnum.DEFAULT || team2 === Enum.TeamEnum.DEFAULT) || team1 === team2;
        }
        
        private collideMapCallback(bullet: Phaser.Bullet): void {
            bullet.data.bounce--;
            if (bullet.data.bounce < 0) {
                bullet.kill();
            }
        }
        
        private collideTankCallback(bullet: Phaser.Bullet, tankSprite: Phaser.Sprite): void {
            bullet.kill();
            if (this.tank.getHealth() > 0) {
                this.hitter.play(this.tank.getPosition());
            }
        }
        
        private overlapTankCallback(bullet: Phaser.Bullet, tankSprite: Phaser.Sprite): void {
            if (tankSprite.data.id !== app.User.getId()) {
                bullet.kill();
                if (this.isSameTeam(tankSprite.data.team, app.User.getTeam())) {
                    this.tanks[tankSprite.data.id].removeHealth(bullet.data.hit);
                    app.Socket.setTankTouch(tankSprite.data.id, bullet.data.hit);

                    if (this.tanks[tankSprite.data.id].getHealth() > 0) {
                        this.hitter.play(this.tanks[tankSprite.data.id].getPosition());
                    }
                }
            } else if (tankSprite.data.id === app.User.getId() && bullet.data.bounce <= 0) {
                bullet.kill();
                app.Socket.setTankTouch(tankSprite.data.id, bullet.data.hit);

                if (this.tank.getHealth() > 0) {
                    this.hitter.play(this.tank.getPosition());
                }
            }
        }

        private addTankToGroup(tank: app.Gaming.Tank): void {
            this.tankGroup.add(tank.shadow);
            this.tankGroup.add(tank.body);
            this.tankGroup.add(tank.turret);
        }
    }
}