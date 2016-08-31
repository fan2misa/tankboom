var src;
(function (src) {
    var Game = (function () {
        function Game() {
        }
        Game.get = function () {
            return this.phaserGame;
        };
        Game.run = function (width, height, data) {
            width = null !== width ? width : window.outerWidth;
            height = null !== height ? height : window.outerHeight;
            this.phaserGame = new Phaser.Game(width, height, Phaser.CANVAS, 'content', {
                preload: data.preload,
                create: data.create,
                update: data.update,
                render: data.render
            });
        };
        return Game;
    })();
    src.Game = Game;
})(src || (src = {}));
var src;
(function (src) {
    var Gaming;
    (function (Gaming) {
        var Tank = (function () {
            function Tank(team, point) {
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
            Tank.prototype.getHealth = function () {
                return this.body.data.health;
            };
            Tank.prototype.setHealth = function (health) {
                this.body.data.health = health;
            };
            Tank.prototype.addHealth = function (health) {
                this.body.data.health += health;
            };
            Tank.prototype.removeHealth = function (health) {
                this.body.data.health -= health;
                if (this.body.data.health < 0) {
                    this.body.data.health = 0;
                }
            };
            Tank.prototype.isAlive = function () {
                return this.body.data.health > 0;
            };
            Tank.prototype.isDead = function () {
                return this.body.data.health <= 0;
            };
            Tank.prototype.getWeapon = function () {
                return this.weapon;
            };
            Tank.prototype.accelerate = function () {
                this.body.data.speed += 5;
                this.body.data.speed = this.body.data.speed > 100 ? 100 : this.body.data.speed;
                src.Game.get().physics.arcade.velocityFromRotation(this.body.rotation, this.body.data.speed, this.body.body.velocity);
                this.setTurretPosition();
                this.setShadowPosition();
            };
            Tank.prototype.retreat = function () {
                this.body.data.speed -= 5;
                this.body.data.speed = this.body.data.speed < -100 ? -100 : this.body.data.speed;
                src.Game.get().physics.arcade.velocityFromRotation(this.body.rotation, this.body.data.speed, this.body.body.velocity);
                this.setTurretPosition();
                this.setShadowPosition();
            };
            Tank.prototype.decelerate = function () {
                if (this.body.data.speed < 0) {
                    this.body.data.speed += 3;
                    this.body.data.speed = this.body.data.speed > 0 ? 0 : this.body.data.speed;
                }
                else {
                    this.body.data.speed -= 3;
                    this.body.data.speed = this.body.data.speed < 0 ? 0 : this.body.data.speed;
                }
                src.Game.get().physics.arcade.velocityFromRotation(this.body.rotation, this.body.data.speed, this.body.body.velocity);
                this.setTurretPosition();
                this.setShadowPosition();
            };
            Tank.prototype.turnLeft = function () {
                this.body.angle -= 4;
                this.setTurretPosition();
                this.setShadowPosition();
            };
            Tank.prototype.turnRight = function () {
                this.body.angle += 4;
                this.setTurretPosition();
                this.setShadowPosition();
            };
            Tank.prototype.wrap = function () {
                src.Game.get().world.wrap(this.body, 16);
            };
            Tank.prototype.explose = function () {
                this.body.kill();
                this.turret.kill();
                this.shadow.kill();
                var explosionAnimation = this.explosions.getFirstExists(false);
                explosionAnimation.reset(this.body.x, this.body.y);
                explosionAnimation.play('tank-explosion', 30, false, true);
            };
            Tank.prototype.destroy = function () {
                this.body.destroy();
                this.turret.destroy();
            };
            Tank.prototype.getTeam = function () {
                return this.team;
            };
            Tank.prototype.isInMovement = function () {
                return this.body.data.speed !== 0;
            };
            Tank.prototype.getPosition = function () {
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
            };
            Tank.prototype.setTurretPosition = function () {
                this.turret.x = this.body.x;
                this.turret.y = this.body.y;
            };
            Tank.prototype.setShadowPosition = function () {
                this.shadow.x = this.body.x;
                this.shadow.y = this.body.y;
                this.shadow.angle = this.body.angle;
            };
            return Tank;
        })();
        Gaming.Tank = Tank;
    })(Gaming = src.Gaming || (src.Gaming = {}));
})(src || (src = {}));
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var src;
(function (src) {
    var Gaming;
    (function (Gaming) {
        var Weapon = (function () {
            function Weapon(tank, turret, fireRate, bulletSpeed) {
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
            Weapon.prototype.getBullets = function () {
                return this.bullets;
            };
            Weapon.prototype.fire = function (callback) {
                if (src.Game.get().time.now > this.nextFire && this.bullets.countDead() > 0) {
                    this.nextFire = src.Game.get().time.now + this.fireRate;
                    var bullet = this.createBullet();
                    bullet.rotation = src.Game.get().physics.arcade.moveToPointer(bullet, this.bulletSpeed, src.Game.get().input.activePointer);
                    callback();
                }
            };
            Weapon.prototype.fireToXY = function (position) {
                var bullet = this.createBullet();
                bullet.rotation = src.Game.get().physics.arcade.moveToXY(bullet, position.x, position.y, this.bulletSpeed);
            };
            Weapon.prototype.createBullet = function () {
                var bullet = this.bullets.getFirstExists(false, true);
                bullet.reset(this.turret.x, this.turret.y);
                bullet.data.speed = this.bulletSpeed;
                bullet.body.bounce.x = 1;
                bullet.body.bounce.y = 1;
                bullet.data.hit = 1;
                bullet.data.bounce = 1;
                return bullet;
            };
            return Weapon;
        })();
        Gaming.Weapon = Weapon;
    })(Gaming = src.Gaming || (src.Gaming = {}));
})(src || (src = {}));
var src;
(function (src) {
    var Map;
    (function (Map_1) {
        var Map = (function () {
            function Map() {
            }
            Map.preload = function () {
                src.Game.get().load.image('tileset', 'img/tileset/tileset.png');
                src.Game.get().load.tilemap('map1', 'tilemaps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
            };
            Map.init = function (map) {
                src.Game.get().world.setBounds(-1000, -1000, 2000, 2000);
                this.map = src.Game.get().add.tilemap(map);
                this.map.addTilesetImage('tileset');
                this.layerBackground = this.map.createLayer('Background');
                this.layerBackground.resizeWorld();
                this.layerWall = this.map.createLayer('Wall');
                this.layerWall.resizeWorld();
                this.map.setCollision(1, true, this.layerWall);
            };
            Map.getPositionByPoint = function (point) {
                return {
                    x: point.x * this.map.tileWidth + (this.map.tileWidth / 2),
                    y: point.y * this.map.tileHeight + (this.map.tileHeight / 2),
                    angle: point.angle
                };
            };
            Map.getTileWidth = function () {
                return this.map.tileWidth;
            };
            Map.getTileHeight = function () {
                return this.map.tileHeight;
            };
            Map.getWall = function () {
                return this.layerWall;
            };
            return Map;
        })();
        Map_1.Map = Map;
    })(Map = src.Map || (src.Map = {}));
})(src || (src = {}));
var src;
(function (src) {
    var Map;
    (function (Map) {
        var Point = (function () {
            function Point(point) {
                this.x = point.x * src.Map.Map.getTileWidth() + (src.Map.Map.getTileWidth() / 2);
                this.y = point.y * src.Map.Map.getTileHeight() + (src.Map.Map.getTileHeight() / 2);
                this.angle = this.generateAngle(point.angle);
            }
            Point.prototype.getX = function () {
                return this.x;
            };
            Point.prototype.getY = function () {
                return this.y;
            };
            Point.prototype.getAngle = function () {
                return this.angle;
            };
            Point.prototype.generateAngle = function (angle) {
                switch (angle) {
                    case 'west': return 0;
                    case 'west-south': return 45;
                    case 'south': return 90;
                    case 'south-east': return 135;
                    case 'east': return 180;
                    case 'east-north': return 225;
                    case 'north': return 270;
                    case 'north-west': return 315;
                }
            };
            return Point;
        })();
        Map.Point = Point;
    })(Map = src.Map || (src.Map = {}));
})(src || (src = {}));
var src;
(function (src) {
    var Parameter = (function () {
        function Parameter() {
        }
        Parameter.init = function () {
            this.data = {
                "sceneWidth": 1120,
                "sceneHeight": 640,
                "margin": 50
            };
        };
        Parameter.get = function (key) {
            return this.data[key];
        };
        return Parameter;
    })();
    src.Parameter = Parameter;
})(src || (src = {}));
var src;
(function (src) {
    var Scene;
    (function (Scene) {
        var Button = (function () {
            function Button(textureDeactivate, textureActivate, x, y) {
                this.active = false;
                this.textureActivate = textureActivate;
                this.textureDeactivate = textureDeactivate;
                this.phaserButton = src.Game.get().add.button(x, y, this.textureDeactivate);
            }
            Button.prototype.deactivate = function () {
                this.phaserButton.loadTexture(this.textureDeactivate);
                this.active = false;
            };
            Button.prototype.activate = function () {
                this.phaserButton.loadTexture(this.textureActivate);
                this.active = true;
            };
            Button.prototype.toogleActivation = function () {
                this.active ? this.deactivate() : this.activate();
            };
            Button.prototype.getX = function () {
                return this.phaserButton.x;
            };
            Button.prototype.getY = function () {
                return this.phaserButton.y;
            };
            Button.prototype.getWidth = function () {
                return this.phaserButton.width;
            };
            Button.prototype.onClick = function (callback) {
                this.phaserButton.events.onInputDown.add(callback, this);
            };
            Button.prototype.destroy = function () {
                this.phaserButton.destroy();
            };
            Button.prototype.setAnchor = function (x, y) {
                this.phaserButton.anchor.set(x, y);
            };
            return Button;
        })();
        Scene.Button = Button;
    })(Scene = src.Scene || (src.Scene = {}));
})(src || (src = {}));
var src;
(function (src) {
    var Scene;
    (function (Scene) {
        var Panel = (function () {
            function Panel(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.phaserGraphics = src.Game.get().add.graphics(this.getX(), this.getY());
                this.users = new Array();
                this.readys = new Array();
            }
            Panel.prototype.addPlayer = function (player) {
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
            };
            Panel.prototype.blockRender = function (color) {
                this.phaserGraphics.clear();
                this.phaserGraphics.beginFill(0x333333, 0.5);
                this.phaserGraphics.lineStyle(1, color, 1);
                this.phaserGraphics.moveTo(this.getHalfMargin(), this.getHalfMargin());
                this.phaserGraphics.lineTo(this.getWidth() - this.getHalfMargin(), this.getHalfMargin());
                this.phaserGraphics.lineTo(this.getWidth() - this.getHalfMargin(), this.getHeight() - this.getHalfMargin());
                this.phaserGraphics.lineTo(this.getHalfMargin(), this.getHeight() - this.getHalfMargin());
                this.phaserGraphics.lineTo(this.getHalfMargin(), this.getHalfMargin());
                this.phaserGraphics.endFill();
            };
            Panel.prototype.removeAllPlayers = function () {
                this.users.forEach(function (item) {
                    item.destroy();
                });
                this.readys.forEach(function (item) {
                    item.destroy();
                });
                this.users = new Array();
                this.readys = new Array();
            };
            Panel.prototype.onClick = function (callback) {
                this.phaserGraphics.inputEnabled = true;
                this.phaserGraphics.events.onInputDown.add(callback, this);
            };
            Panel.prototype.getX = function () {
                return ((this.x * this.getFullWidth()) / 100) + this.getHalfMargin();
            };
            Panel.prototype.getY = function () {
                return (this.y * this.getFullHeight()) / 100 + this.getHalfMargin();
            };
            Panel.prototype.getWidth = function () {
                return (this.width * this.getFullWidth()) / 100;
            };
            Panel.prototype.getHeight = function () {
                return (this.height * this.getFullHeight()) / 100;
            };
            Panel.prototype.getFullWidth = function () {
                return src.Parameter.get('sceneWidth') - this.getMargin() - 250;
            };
            Panel.prototype.getFullHeight = function () {
                return src.Parameter.get('sceneHeight') - this.getMargin();
            };
            Panel.prototype.getHalfMargin = function () {
                return src.Parameter.get('margin') / 2;
            };
            Panel.prototype.getMargin = function () {
                return src.Parameter.get('margin');
            };
            Panel.prototype.destroy = function () {
                this.removeAllPlayers();
                this.phaserGraphics.destroy();
            };
            return Panel;
        })();
        Scene.Panel = Panel;
    })(Scene = src.Scene || (src.Scene = {}));
})(src || (src = {}));
var src;
(function (src) {
    var Scene;
    (function (Scene_1) {
        var Scene = (function () {
            function Scene() {
            }
            return Scene;
        })();
        Scene_1.Scene = Scene;
    })(Scene = src.Scene || (src.Scene = {}));
})(src || (src = {}));
var src;
(function (src) {
    var Scene;
    (function (Scene) {
        var SceneManager = (function () {
            function SceneManager() {
            }
            SceneManager.init = function () {
                this.scenes = new Array();
                this.scenes[app.Enum.SceneEnum.WAIT] = new app.Scene.MainMenu.WaitScene();
                this.scenes[app.Enum.SceneEnum.WAIT].init();
                this.scenes[app.Enum.SceneEnum.MAINMENU] = new app.Scene.MainMenu.MainMenuScene();
                this.scenes[app.Enum.SceneEnum.MAINMENU].init();
                this.scenes[app.Enum.SceneEnum.INGAME] = new app.Scene.InGame.InGameScene();
                this.scenes[app.Enum.SceneEnum.INGAME].init();
            };
            SceneManager.start = function () {
                if (undefined !== this.scene) {
                    src.Game.get().world.removeAll();
                    src.Game.get().camera.setPosition(0, 0);
                }
                this.scene = this.scenes[app.Server.getScene()];
                this.scene.start();
            };
            return SceneManager;
        })();
        Scene.SceneManager = SceneManager;
    })(Scene = src.Scene || (src.Scene = {}));
})(src || (src = {}));
var app;
(function (app) {
    var App = (function () {
        function App() {
            src.Parameter.init();
            src.Game.run(src.Parameter.get('sceneWidth'), src.Parameter.get('sceneHeight'), {
                preload: this.preload,
                create: this.create,
                update: this.update,
                render: this.render
            });
        }
        App.prototype.preload = function () {
            app.Scene.MainMenu.MainMenuScene.preload();
            src.Map.Map.preload();
            app.Gaming.Tank.preload();
            app.Gaming.Weapon.preload();
        };
        App.prototype.create = function () {
            src.Scene.SceneManager.init();
            if (app.Server.getScene() !== app.Enum.SceneEnum.INGAME) {
                src.Scene.SceneManager.start();
            }
            else {
            }
        };
        App.prototype.update = function () {
            src.Scene.SceneManager.scene.update();
        };
        App.prototype.render = function () {
            src.Scene.SceneManager.scene.render();
        };
        return App;
    })();
    app.App = App;
})(app || (app = {}));
var app;
(function (app) {
    var Command;
    (function (Command_1) {
        var Command = (function () {
            function Command() {
                this.mouseButtonLeftUped = true;
                this.cursors = src.Game.get().input.keyboard.createCursorKeys();
                this.buttonUp = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.Z);
                this.buttonDown = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.S);
                this.buttonLeft = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.Q);
                this.buttonRight = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.D);
                this.buttonFire = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            }
            Command.prototype.up = function () {
                return this.cursors.up.isDown || this.buttonUp.isDown;
            };
            Command.prototype.down = function () {
                return this.cursors.down.isDown || this.buttonDown.isDown;
            };
            Command.prototype.left = function () {
                return this.cursors.left.isDown || this.buttonLeft.isDown;
            };
            Command.prototype.right = function () {
                return this.cursors.right.isDown || this.buttonRight.isDown;
            };
            Command.prototype.space = function () {
                return this.buttonFire.isDown;
            };
            Command.prototype.leftClick = function () {
                if (this.mouseButtonLeftUped && src.Game.get().input.activePointer.leftButton.isDown) {
                    this.mouseButtonLeftUped = false;
                    return true;
                }
                else if (src.Game.get().input.activePointer.leftButton.isUp) {
                    this.mouseButtonLeftUped = true;
                }
                return false;
            };
            return Command;
        })();
        Command_1.Command = Command;
    })(Command = app.Command || (app.Command = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Enum;
    (function (Enum) {
        var GameTypeEnum = (function () {
            function GameTypeEnum() {
            }
            GameTypeEnum.DEADMATCH = 'deadmatch';
            GameTypeEnum.DEADMATCHTEAM2 = 'deadmatchteam2';
            GameTypeEnum.DEADMATCHTEAM4 = 'deadmatchteam4';
            GameTypeEnum.CAPTUREFLAG = 'captureflag';
            return GameTypeEnum;
        })();
        Enum.GameTypeEnum = GameTypeEnum;
    })(Enum = app.Enum || (app.Enum = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Enum;
    (function (Enum) {
        var SceneEnum = (function () {
            function SceneEnum() {
            }
            SceneEnum.WAIT = 'wait';
            SceneEnum.MAINMENU = 'mainmenu';
            SceneEnum.INGAME = 'ingame';
            return SceneEnum;
        })();
        Enum.SceneEnum = SceneEnum;
    })(Enum = app.Enum || (app.Enum = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Enum;
    (function (Enum) {
        var TeamEnum = (function () {
            function TeamEnum() {
            }
            TeamEnum.DEFAULT = 'default';
            TeamEnum.BLUE = 'blue';
            TeamEnum.RED = 'red';
            TeamEnum.GREEN = 'green';
            TeamEnum.YELLOW = 'yellow';
            return TeamEnum;
        })();
        Enum.TeamEnum = TeamEnum;
    })(Enum = app.Enum || (app.Enum = {}));
})(app || (app = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app;
(function (app) {
    var Gaming;
    (function (Gaming) {
        var Tank = (function (_super) {
            __extends(Tank, _super);
            function Tank(id, team, position) {
                _super.call(this, team, position);
                this.body.data.id = id;
            }
            Tank.preload = function () {
                src.Game.get().load.spritesheet('tank-explosion', 'img/explosion/tank.png', 64, 64, 23);
                src.Game.get().load.spritesheet('tank-hit', 'img/tank/hit.png', 80, 80, 9);
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
            };
            Tank.prototype.setPosition = function (position) {
                this.body.x = position.tank.x;
                this.body.y = position.tank.y;
                this.body.angle = position.tank.angle;
                this.turret.x = position.turret.x;
                this.turret.y = position.turret.y;
                this.turret.angle = position.turret.angle;
                this.setShadowPosition();
            };
            return Tank;
        })(src.Gaming.Tank);
        Gaming.Tank = Tank;
    })(Gaming = app.Gaming || (app.Gaming = {}));
})(app || (app = {}));
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app;
(function (app) {
    var Gaming;
    (function (Gaming) {
        var Weapon = (function (_super) {
            __extends(Weapon, _super);
            function Weapon(tank, turret) {
                _super.call(this, tank, turret, 1000, 400);
            }
            Weapon.preload = function () {
                src.Game.get().load.spritesheet('bullet-explosion', 'img/explosion/bullet.png', 32, 32, 23);
                src.Game.get().load.image('bullet', 'img/tank/bullet2.png');
            };
            return Weapon;
        })(src.Gaming.Weapon);
        Gaming.Weapon = Weapon;
    })(Gaming = app.Gaming || (app.Gaming = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var InGame;
        (function (InGame) {
            var InGameScene = (function (_super) {
                __extends(InGameScene, _super);
                function InGameScene() {
                    _super.call(this);
                    this.tanks = new Array();
                }
                InGameScene.prototype.init = function () {
                    var me = this;
                    app.Socket.onPositionSended(function (user) {
                        me.tanks[user.id].setPosition(user.position);
                    });
                    app.Socket.onTraceSended(function (user) {
                        me.tracer.set(me.tanks[user.id].getPosition());
                    });
                    app.Socket.onFireSended(function (user) {
                        me.tanks[user.id].getWeapon().fireToXY(user.position);
                    });
                    app.Socket.onTankTouched(function (user, hit) {
                        if (user.id === app.User.getId()) {
                            me.tank.removeHealth(hit);
                            if (me.tank.isDead()) {
                                me.tank.explose();
                                app.Socket.setTankExplose();
                            }
                        }
                    });
                    app.Socket.onTankExplosed(function (user) {
                        me.tanks[user.id].explose();
                    });
                    app.Socket.onRespawn(function () {
                        me.tank = new app.Gaming.Tank(app.User.getId(), app.User.getTeam(), new src.Map.Point(app.User.getPosition()));
                        me.tank.setHealth(app.User.getHealt());
                        me.addTankToGroup(me.tank);
                        me.lifeContainer.setTank(me.tank);
                    });
                    app.Socket.onTankRespawned(function (user) {
                        me.tanks[user.id] = new app.Gaming.Tank(user.id, user.team, new src.Map.Point(user.position));
                        me.tanks[user.id].setHealth(user.healt);
                        me.addTankToGroup(me.tanks[user.id]);
                    });
                    app.Socket.onEndGame(function (winner) {
                        if (app.Server.getScene() === app.Enum.SceneEnum.INGAME) {
                            me.setMessage("Victoire de " + winner);
                        }
                    });
                    app.Socket.onReturnToMenu(function () {
                        src.Scene.SceneManager.start();
                    });
                };
                InGameScene.prototype.start = function () {
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
                };
                InGameScene.prototype.update = function () {
                    var _this = this;
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
                        }
                        else if (this.command.down()) {
                            this.tank.retreat();
                        }
                        else {
                            this.tank.decelerate();
                        }
                        if (this.command.left()) {
                            this.tank.turnLeft();
                        }
                        else if (this.command.right()) {
                            this.tank.turnRight();
                        }
                        if (this.command.leftClick()) {
                            this.tank.getWeapon().fire(function () {
                                app.Socket.setFire(_this.tank);
                            });
                        }
                        if (this.tank.isInMovement()) {
                            this.tracer.generate(this.tank.getPosition(), function () {
                                app.Socket.setTracer(_this.tank);
                            });
                        }
                        app.Socket.setPosition(this.tank);
                    }
                };
                InGameScene.prototype.render = function () {
                    this.lifeContainer.refresh();
                };
                InGameScene.prototype.setMessage = function (text) {
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
                };
                InGameScene.prototype.isSameTeam = function (team1, team2) {
                    return !(team1 === app.Enum.TeamEnum.DEFAULT || team2 === app.Enum.TeamEnum.DEFAULT) || team1 === team2;
                };
                InGameScene.prototype.collideMapCallback = function (bullet) {
                    bullet.data.bounce--;
                    if (bullet.data.bounce < 0) {
                        bullet.kill();
                    }
                };
                InGameScene.prototype.collideTankCallback = function (bullet, tankSprite) {
                    bullet.kill();
                    if (this.tank.getHealth() > 0) {
                        this.hitter.play(this.tank.getPosition());
                    }
                };
                InGameScene.prototype.overlapTankCallback = function (bullet, tankSprite) {
                    if (tankSprite.data.id !== app.User.getId()) {
                        bullet.kill();
                        if (this.isSameTeam(tankSprite.data.team, app.User.getTeam())) {
                            this.tanks[tankSprite.data.id].removeHealth(bullet.data.hit);
                            app.Socket.setTankTouch(tankSprite.data.id, bullet.data.hit);
                            if (this.tanks[tankSprite.data.id].getHealth() > 0) {
                                this.hitter.play(this.tanks[tankSprite.data.id].getPosition());
                            }
                        }
                    }
                    else if (tankSprite.data.id === app.User.getId() && bullet.data.bounce <= 0) {
                        bullet.kill();
                        app.Socket.setTankTouch(tankSprite.data.id, bullet.data.hit);
                        if (this.tank.getHealth() > 0) {
                            this.hitter.play(this.tank.getPosition());
                        }
                    }
                };
                InGameScene.prototype.addTankToGroup = function (tank) {
                    this.tankGroup.add(tank.shadow);
                    this.tankGroup.add(tank.body);
                    this.tankGroup.add(tank.turret);
                };
                return InGameScene;
            })(src.Scene.Scene);
            InGame.InGameScene = InGameScene;
        })(InGame = Scene.InGame || (Scene.InGame = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Block;
            (function (Block_1) {
                var Block = (function () {
                    function Block() {
                    }
                    return Block;
                })();
                Block_1.Block = Block;
            })(Block = MainMenu.Block || (MainMenu.Block = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Block;
            (function (Block) {
                var CaptureFlagBlock = (function (_super) {
                    __extends(CaptureFlagBlock, _super);
                    function CaptureFlagBlock() {
                        _super.call(this);
                        this.panelBlue = new app.Scene.MainMenu.Panel.TeamBluePanel(0, 0, 50, 100);
                        this.panelRed = new app.Scene.MainMenu.Panel.TeamRedPanel(50, 0, 50, 100);
                    }
                    CaptureFlagBlock.prototype.displayUsers = function () {
                        this.removeAllUsers();
                        for (var i in app.Server.getUsers()) {
                            switch (app.Server.getUsers()[i].team) {
                                case app.Enum.TeamEnum.BLUE:
                                    this.panelBlue.addPlayer(app.Server.getUsers()[i]);
                                    break;
                                case app.Enum.TeamEnum.RED:
                                    this.panelRed.addPlayer(app.Server.getUsers()[i]);
                                    break;
                            }
                        }
                    };
                    CaptureFlagBlock.prototype.removeAllUsers = function () {
                        this.panelBlue.removeAllPlayers();
                        this.panelRed.removeAllPlayers();
                    };
                    CaptureFlagBlock.prototype.destroy = function () {
                        this.panelBlue.destroy();
                        this.panelRed.destroy();
                    };
                    return CaptureFlagBlock;
                })(app.Scene.MainMenu.Block.Block);
                Block.CaptureFlagBlock = CaptureFlagBlock;
            })(Block = MainMenu.Block || (MainMenu.Block = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Block;
            (function (Block) {
                var DeadmatchBlock = (function (_super) {
                    __extends(DeadmatchBlock, _super);
                    function DeadmatchBlock() {
                        _super.call(this);
                        this.panel = new app.Scene.MainMenu.Panel.TeamDefaultPanel(0, 0, 100, 100);
                    }
                    DeadmatchBlock.prototype.displayUsers = function () {
                        this.removeAllUsers();
                        for (var i in app.Server.getUsers()) {
                            this.panel.addPlayer(app.Server.getUsers()[i]);
                        }
                    };
                    DeadmatchBlock.prototype.removeAllUsers = function () {
                        this.panel.removeAllPlayers();
                    };
                    DeadmatchBlock.prototype.destroy = function () {
                        this.panel.destroy();
                    };
                    return DeadmatchBlock;
                })(app.Scene.MainMenu.Block.Block);
                Block.DeadmatchBlock = DeadmatchBlock;
            })(Block = MainMenu.Block || (MainMenu.Block = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Block;
            (function (Block) {
                var DeadmatchTeam2Block = (function (_super) {
                    __extends(DeadmatchTeam2Block, _super);
                    function DeadmatchTeam2Block() {
                        _super.call(this);
                        this.panelBlue = new app.Scene.MainMenu.Panel.TeamBluePanel(0, 0, 50, 100);
                        this.panelRed = new app.Scene.MainMenu.Panel.TeamRedPanel(50, 0, 50, 100);
                    }
                    DeadmatchTeam2Block.prototype.displayUsers = function () {
                        this.removeAllUsers();
                        for (var i in app.Server.getUsers()) {
                            switch (app.Server.getUsers()[i].team) {
                                case app.Enum.TeamEnum.BLUE:
                                    this.panelBlue.addPlayer(app.Server.getUsers()[i]);
                                    break;
                                case app.Enum.TeamEnum.RED:
                                    this.panelRed.addPlayer(app.Server.getUsers()[i]);
                                    break;
                            }
                        }
                    };
                    DeadmatchTeam2Block.prototype.removeAllUsers = function () {
                        this.panelBlue.removeAllPlayers();
                        this.panelRed.removeAllPlayers();
                    };
                    DeadmatchTeam2Block.prototype.destroy = function () {
                        this.panelBlue.destroy();
                        this.panelRed.destroy();
                    };
                    return DeadmatchTeam2Block;
                })(app.Scene.MainMenu.Block.Block);
                Block.DeadmatchTeam2Block = DeadmatchTeam2Block;
            })(Block = MainMenu.Block || (MainMenu.Block = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Block;
            (function (Block) {
                var DeadmatchTeam4Block = (function (_super) {
                    __extends(DeadmatchTeam4Block, _super);
                    function DeadmatchTeam4Block() {
                        _super.call(this);
                        this.panelBlue = new app.Scene.MainMenu.Panel.TeamBluePanel(0, 0, 50, 50);
                        this.panelRed = new app.Scene.MainMenu.Panel.TeamRedPanel(50, 0, 50, 50);
                        this.panelGreen = new app.Scene.MainMenu.Panel.TeamGreenPanel(0, 50, 50, 50);
                        this.panelYellow = new app.Scene.MainMenu.Panel.TeamYellowPanel(50, 50, 50, 50);
                    }
                    DeadmatchTeam4Block.prototype.displayUsers = function () {
                        this.removeAllUsers();
                        for (var i in app.Server.getUsers()) {
                            switch (app.Server.getUsers()[i].team) {
                                case app.Enum.TeamEnum.BLUE:
                                    this.panelBlue.addPlayer(app.Server.getUsers()[i]);
                                    break;
                                case app.Enum.TeamEnum.RED:
                                    this.panelRed.addPlayer(app.Server.getUsers()[i]);
                                    break;
                                case app.Enum.TeamEnum.GREEN:
                                    this.panelGreen.addPlayer(app.Server.getUsers()[i]);
                                    break;
                                case app.Enum.TeamEnum.YELLOW:
                                    this.panelYellow.addPlayer(app.Server.getUsers()[i]);
                                    break;
                            }
                        }
                    };
                    DeadmatchTeam4Block.prototype.removeAllUsers = function () {
                        this.panelBlue.removeAllPlayers();
                        this.panelRed.removeAllPlayers();
                        this.panelGreen.removeAllPlayers();
                        this.panelYellow.removeAllPlayers();
                    };
                    DeadmatchTeam4Block.prototype.destroy = function () {
                        this.panelBlue.destroy();
                        this.panelRed.destroy();
                        this.panelGreen.destroy();
                        this.panelYellow.destroy();
                    };
                    return DeadmatchTeam4Block;
                })(app.Scene.MainMenu.Block.Block);
                Block.DeadmatchTeam4Block = DeadmatchTeam4Block;
            })(Block = MainMenu.Block || (MainMenu.Block = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Button;
            (function (Button) {
                var ButtonReady = (function (_super) {
                    __extends(ButtonReady, _super);
                    function ButtonReady() {
                        var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
                        var y = src.Parameter.get('sceneHeight') - src.Parameter.get('margin');
                        _super.call(this, 'button-ready-deactivate', 'button-ready-activate', x, y);
                        this.setAnchor(1, 1);
                        this.onClick(this.handleAction);
                    }
                    ButtonReady.preload = function () {
                        src.Game.get().load.image('button-ready-deactivate', 'img/button/ready/button-deactivate.png');
                        src.Game.get().load.image('button-ready-activate', 'img/button/ready/button-activate.png');
                    };
                    ButtonReady.prototype.handleAction = function () {
                        this.toogleActivation();
                        app.User.setReady(!app.Server.getUser().ready);
                        app.Socket.setUserReady();
                    };
                    return ButtonReady;
                })(src.Scene.Button);
                Button.ButtonReady = ButtonReady;
            })(Button = MainMenu.Button || (MainMenu.Button = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Button;
            (function (Button) {
                var GameType;
                (function (GameType) {
                    var ButtonCaptureFlag = (function (_super) {
                        __extends(ButtonCaptureFlag, _super);
                        function ButtonCaptureFlag() {
                            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
                            var y = 180 + src.Parameter.get('margin');
                            _super.call(this, 'button-captureflag-deactivate', 'button-captureflag-activate', x, y);
                            this.setAnchor(1, 0);
                            this.onClick(this.handleAction);
                        }
                        ButtonCaptureFlag.preload = function () {
                            src.Game.get().load.image('button-captureflag-deactivate', 'img/button/captureflag/button-deactivate.png');
                            src.Game.get().load.image('button-captureflag-activate', 'img/button/captureflag/button-activate.png');
                        };
                        ButtonCaptureFlag.prototype.handleAction = function () {
                            app.Socket.setGameType(app.Enum.GameTypeEnum.CAPTUREFLAG);
                        };
                        return ButtonCaptureFlag;
                    })(src.Scene.Button);
                    GameType.ButtonCaptureFlag = ButtonCaptureFlag;
                })(GameType = Button.GameType || (Button.GameType = {}));
            })(Button = MainMenu.Button || (MainMenu.Button = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Button;
            (function (Button) {
                var GameType;
                (function (GameType) {
                    var ButtonDeadmatch = (function (_super) {
                        __extends(ButtonDeadmatch, _super);
                        function ButtonDeadmatch() {
                            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
                            var y = 0 + src.Parameter.get('margin');
                            _super.call(this, 'button-deadmatch-deactivate', 'button-deadmatch-activate', x, y);
                            this.setAnchor(1, 0);
                            this.onClick(this.handleAction);
                        }
                        ButtonDeadmatch.preload = function () {
                            src.Game.get().load.image('button-deadmatch-deactivate', 'img/button/deadmatch/button-deactivate.png');
                            src.Game.get().load.image('button-deadmatch-activate', 'img/button/deadmatch/button-activate.png');
                        };
                        ButtonDeadmatch.prototype.handleAction = function () {
                            app.Socket.setGameType(app.Enum.GameTypeEnum.DEADMATCH);
                        };
                        return ButtonDeadmatch;
                    })(src.Scene.Button);
                    GameType.ButtonDeadmatch = ButtonDeadmatch;
                })(GameType = Button.GameType || (Button.GameType = {}));
            })(Button = MainMenu.Button || (MainMenu.Button = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Button;
            (function (Button) {
                var GameType;
                (function (GameType) {
                    var ButtonDeadmatchTeam2 = (function (_super) {
                        __extends(ButtonDeadmatchTeam2, _super);
                        function ButtonDeadmatchTeam2() {
                            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
                            var y = 60 + src.Parameter.get('margin');
                            _super.call(this, 'button-deadmatchteam2-deactivate', 'button-deadmatchteam2-activate', x, y);
                            this.setAnchor(1, 0);
                            this.onClick(this.handleAction);
                        }
                        ButtonDeadmatchTeam2.preload = function () {
                            src.Game.get().load.image('button-deadmatchteam2-deactivate', 'img/button/deadmatchteam2/button-deactivate.png');
                            src.Game.get().load.image('button-deadmatchteam2-activate', 'img/button/deadmatchteam2/button-activate.png');
                        };
                        ButtonDeadmatchTeam2.prototype.handleAction = function () {
                            app.Socket.setGameType(app.Enum.GameTypeEnum.DEADMATCHTEAM2);
                        };
                        return ButtonDeadmatchTeam2;
                    })(src.Scene.Button);
                    GameType.ButtonDeadmatchTeam2 = ButtonDeadmatchTeam2;
                })(GameType = Button.GameType || (Button.GameType = {}));
            })(Button = MainMenu.Button || (MainMenu.Button = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Button;
            (function (Button) {
                var GameType;
                (function (GameType) {
                    var ButtonDeadmatchTeam4 = (function (_super) {
                        __extends(ButtonDeadmatchTeam4, _super);
                        function ButtonDeadmatchTeam4() {
                            var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin');
                            var y = 120 + src.Parameter.get('margin');
                            _super.call(this, 'button-deadmatchteam4-deactivate', 'button-deadmatchteam4-activate', x, y);
                            this.setAnchor(1, 0);
                            this.onClick(this.handleAction);
                        }
                        ButtonDeadmatchTeam4.preload = function () {
                            src.Game.get().load.image('button-deadmatchteam4-deactivate', 'img/button/deadmatchteam4/button-deactivate.png');
                            src.Game.get().load.image('button-deadmatchteam4-activate', 'img/button/deadmatchteam4/button-activate.png');
                        };
                        ButtonDeadmatchTeam4.prototype.handleAction = function () {
                            app.Socket.setGameType(app.Enum.GameTypeEnum.DEADMATCHTEAM4);
                        };
                        return ButtonDeadmatchTeam4;
                    })(src.Scene.Button);
                    GameType.ButtonDeadmatchTeam4 = ButtonDeadmatchTeam4;
                })(GameType = Button.GameType || (Button.GameType = {}));
            })(Button = MainMenu.Button || (MainMenu.Button = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var MainMenuScene = (function (_super) {
                __extends(MainMenuScene, _super);
                function MainMenuScene() {
                    _super.call(this);
                    this.buttonsGame = new Array();
                }
                MainMenuScene.preload = function () {
                    app.Scene.MainMenu.Button.ButtonReady.preload();
                    app.Scene.MainMenu.Button.GameType.ButtonDeadmatch.preload();
                    app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam2.preload();
                    app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam4.preload();
                    app.Scene.MainMenu.Button.GameType.ButtonCaptureFlag.preload();
                };
                MainMenuScene.prototype.init = function () {
                    var _this = this;
                    var me = this;
                    app.Socket.onRefreshUsers(function () {
                        me.block.displayUsers();
                    });
                    app.Socket.onGameTypeChanged(function () {
                        me.activeButtonGameType();
                        me.block.displayUsers();
                        me.buttonReady.deactivate();
                    });
                    app.Socket.onTimer(function () {
                        _this.setMiddleText(null !== app.Server.getTimer() ? app.Server.getTimer().toString() : '');
                    });
                    app.Socket.onStartGame(function () {
                        src.Scene.SceneManager.start();
                    });
                };
                MainMenuScene.prototype.start = function () {
                    src.Game.get().world.setBounds(0, 0, src.Parameter.get('sceneWidth'), src.Parameter.get('sceneHeight'));
                    this.generateButtonsGameType();
                    this.activeButtonGameType();
                    this.buttonReady = new app.Scene.MainMenu.Button.ButtonReady();
                    this.block.displayUsers();
                    this.generateMiddleText();
                };
                MainMenuScene.prototype.update = function () {
                };
                MainMenuScene.prototype.render = function () {
                };
                MainMenuScene.prototype.generateButtonsGameType = function () {
                    this.generateButtonDeadmatch();
                    this.generateButtonDeadmatchteam2();
                    this.generateButtonDeadmatchteam4();
                    //            this.generateButtonCaptureFlag();
                };
                MainMenuScene.prototype.generateButtonDeadmatch = function () {
                    this.buttonsGame[app.Enum.GameTypeEnum.DEADMATCH]
                        = new app.Scene.MainMenu.Button.GameType.ButtonDeadmatch();
                };
                MainMenuScene.prototype.generateButtonDeadmatchteam2 = function () {
                    this.buttonsGame[app.Enum.GameTypeEnum.DEADMATCHTEAM2]
                        = new app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam2();
                };
                MainMenuScene.prototype.generateButtonDeadmatchteam4 = function () {
                    this.buttonsGame[app.Enum.GameTypeEnum.DEADMATCHTEAM4]
                        = new app.Scene.MainMenu.Button.GameType.ButtonDeadmatchTeam4();
                };
                MainMenuScene.prototype.generateButtonCaptureFlag = function () {
                    this.buttonsGame[app.Enum.GameTypeEnum.CAPTUREFLAG]
                        = new app.Scene.MainMenu.Button.GameType.ButtonCaptureFlag();
                };
                MainMenuScene.prototype.activeButtonGameType = function () {
                    for (var i in this.buttonsGame) {
                        this.buttonsGame[i].deactivate();
                    }
                    this.buttonsGame[app.Server.getGame()].activate();
                    this.startBlock();
                };
                MainMenuScene.prototype.startBlock = function () {
                    if (this.block) {
                        this.block.destroy();
                    }
                    switch (app.Server.getGame()) {
                        case app.Enum.GameTypeEnum.DEADMATCH:
                            this.block = new app.Scene.MainMenu.Block.DeadmatchBlock();
                            break;
                        case app.Enum.GameTypeEnum.DEADMATCHTEAM2:
                            this.block = new app.Scene.MainMenu.Block.DeadmatchTeam2Block();
                            break;
                        case app.Enum.GameTypeEnum.DEADMATCHTEAM4:
                            this.block = new app.Scene.MainMenu.Block.DeadmatchTeam4Block();
                            break;
                        case app.Enum.GameTypeEnum.CAPTUREFLAG:
                            this.block = new app.Scene.MainMenu.Block.CaptureFlagBlock();
                            break;
                    }
                };
                MainMenuScene.prototype.generateMiddleText = function () {
                    var lastButtonGame = this.buttonsGame[Object.keys(this.buttonsGame)[Object.keys(this.buttonsGame).length - 1]];
                    var x = src.Parameter.get('sceneWidth') - src.Parameter.get('margin') - (lastButtonGame.getWidth() / 2);
                    this.infoText = src.Game.get().add.text(x, lastButtonGame.getY() + ((this.buttonReady.getY() - lastButtonGame.getY()) / 2), '', {
                        font: "72px Arial",
                        fill: "#ffffff",
                        boundsAlignH: "center",
                        boundsAlignV: "middle"
                    });
                    this.infoText.anchor.set(0.5, 0.5);
                };
                MainMenuScene.prototype.setMiddleText = function (text) {
                    this.infoText.setText(text);
                };
                return MainMenuScene;
            })(src.Scene.Scene);
            MainMenu.MainMenuScene = MainMenuScene;
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Panel;
            (function (Panel) {
                var TeamBluePanel = (function (_super) {
                    __extends(TeamBluePanel, _super);
                    function TeamBluePanel(x, y, width, height) {
                        _super.call(this, x, y, width, height);
                        this.blockRender(0x2980b9);
                        this.onClick(this.handleAction);
                    }
                    TeamBluePanel.prototype.handleAction = function () {
                        if (!app.User.isReady()) {
                            app.Socket.setUserTeam(app.Enum.TeamEnum.BLUE);
                        }
                    };
                    return TeamBluePanel;
                })(src.Scene.Panel);
                Panel.TeamBluePanel = TeamBluePanel;
            })(Panel = MainMenu.Panel || (MainMenu.Panel = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Panel;
            (function (Panel) {
                var TeamDefaultPanel = (function (_super) {
                    __extends(TeamDefaultPanel, _super);
                    function TeamDefaultPanel(x, y, width, height) {
                        _super.call(this, x, y, width, height);
                        this.blockRender(0xffffff);
                        this.onClick(this.handleAction);
                    }
                    TeamDefaultPanel.prototype.handleAction = function () {
                        if (!app.User.isReady()) {
                            app.Socket.setUserTeam(app.Enum.TeamEnum.DEFAULT);
                        }
                    };
                    return TeamDefaultPanel;
                })(src.Scene.Panel);
                Panel.TeamDefaultPanel = TeamDefaultPanel;
            })(Panel = MainMenu.Panel || (MainMenu.Panel = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Panel;
            (function (Panel) {
                var TeamGreenPanel = (function (_super) {
                    __extends(TeamGreenPanel, _super);
                    function TeamGreenPanel(x, y, width, height) {
                        _super.call(this, x, y, width, height);
                        this.blockRender(0x27ae60);
                        this.onClick(this.handleAction);
                    }
                    TeamGreenPanel.prototype.handleAction = function () {
                        if (!app.User.isReady()) {
                            app.Socket.setUserTeam(app.Enum.TeamEnum.GREEN);
                        }
                    };
                    return TeamGreenPanel;
                })(src.Scene.Panel);
                Panel.TeamGreenPanel = TeamGreenPanel;
            })(Panel = MainMenu.Panel || (MainMenu.Panel = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Panel;
            (function (Panel) {
                var TeamRedPanel = (function (_super) {
                    __extends(TeamRedPanel, _super);
                    function TeamRedPanel(x, y, width, height) {
                        _super.call(this, x, y, width, height);
                        this.blockRender(0xc0392b);
                        this.onClick(this.handleAction);
                    }
                    TeamRedPanel.prototype.handleAction = function () {
                        if (!app.User.isReady()) {
                            app.Socket.setUserTeam(app.Enum.TeamEnum.RED);
                        }
                    };
                    return TeamRedPanel;
                })(src.Scene.Panel);
                Panel.TeamRedPanel = TeamRedPanel;
            })(Panel = MainMenu.Panel || (MainMenu.Panel = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var Panel;
            (function (Panel) {
                var TeamYellowPanel = (function (_super) {
                    __extends(TeamYellowPanel, _super);
                    function TeamYellowPanel(x, y, width, height) {
                        _super.call(this, x, y, width, height);
                        this.blockRender(0xf39c12);
                        this.onClick(this.handleAction);
                    }
                    TeamYellowPanel.prototype.handleAction = function () {
                        if (!app.User.isReady()) {
                            app.Socket.setUserTeam(app.Enum.TeamEnum.YELLOW);
                        }
                    };
                    return TeamYellowPanel;
                })(src.Scene.Panel);
                Panel.TeamYellowPanel = TeamYellowPanel;
            })(Panel = MainMenu.Panel || (MainMenu.Panel = {}));
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Scene;
    (function (Scene) {
        var MainMenu;
        (function (MainMenu) {
            var WaitScene = (function (_super) {
                __extends(WaitScene, _super);
                function WaitScene() {
                    _super.apply(this, arguments);
                }
                WaitScene.prototype.init = function () {
                    this.time = 0;
                    this.point = 0;
                };
                WaitScene.prototype.start = function () {
                    this.infoText = src.Game.get().add.text(src.Game.get().world.centerX, src.Game.get().world.centerY, 'Une partie est en cours, veuillez patienter', {
                        font: "24px Arial",
                        fill: "#ffffff"
                    });
                    this.infoText.anchor.set(0.5, 0.5);
                    this.infoText2 = src.Game.get().add.text(src.Game.get().world.centerX, src.Game.get().world.centerY + 20, this.getPoint(), {
                        font: "24px Arial",
                        fill: "#ffffff"
                    });
                    this.infoText.anchor.set(0.5, 0.5);
                };
                WaitScene.prototype.update = function () {
                };
                WaitScene.prototype.render = function () {
                    if (src.Game.get().time.now > this.time) {
                        this.time = src.Game.get().time.now + 1000;
                        this.point++;
                        if (this.point > 3) {
                            this.point = 0;
                        }
                        this.infoText2.setText(this.getPoint());
                    }
                };
                WaitScene.prototype.getPoint = function () {
                    var text = '';
                    for (var i = 0; i < this.point; i++) {
                        text += '.';
                    }
                    return text;
                };
                return WaitScene;
            })(src.Scene.Scene);
            MainMenu.WaitScene = WaitScene;
        })(MainMenu = Scene.MainMenu || (Scene.MainMenu = {}));
    })(Scene = app.Scene || (app.Scene = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Server = (function () {
        function Server() {
        }
        Server.start = function () {
            this.data = {};
        };
        Server.getUser = function () {
            return this.data.user;
        };
        Server.getUsers = function () {
            return this.data.users;
        };
        Server.getScene = function () {
            return this.data.scene;
        };
        Server.getGame = function () {
            return this.data.game;
        };
        Server.getNewUser = function () {
            return this.data.newUser;
        };
        Server.getDisconnectedUser = function () {
            return this.data.disconnectedUser;
        };
        Server.getTimer = function () {
            return this.data.timer;
        };
        Server.getMap = function () {
            return this.data.map;
        };
        Server.setData = function (data) {
            var updateUser = true;
            for (var i in data) {
                if (i === 'user') {
                    updateUser = false;
                }
                this.data[i] = data[i];
            }
            if (updateUser) {
                this.data.user = this.data.users[app.User.getId()];
            }
        };
        return Server;
    })();
    app.Server = Server;
})(app || (app = {}));
var app;
(function (app) {
    var Socket = (function () {
        function Socket() {
        }
        Socket.start = function () {
            this.instance = io();
        };
        Socket.connection = function () {
            var username = 'Anonyme';
            if (username = prompt("Votre nom", username)) {
                this.instance.emit('USER_CONNECT', username);
            }
        };
        Socket.onConnection = function (callback) {
            this.instance.on('USER_CONNECT_SUCCESS', function (data) {
                app.Server.setData(data);
                callback();
            });
        };
        Socket.onTimer = function (callback) {
            this.instance.on('SET_TIMER', function (data) {
                app.Server.setData(data);
                callback();
            });
        };
        Socket.setUserReady = function () {
            this.instance.emit('USER_READY');
        };
        Socket.setGameType = function (gameType) {
            this.instance.emit('CHANGE_GAME_TYPE', gameType);
        };
        Socket.setUserTeam = function (team) {
            this.instance.emit('USER_CHANGE_TEAM', team);
        };
        Socket.onGameTypeChanged = function (callback) {
            this.instance.on('GAME_TYPE_CHANGED', function (data) {
                app.Server.setData(data);
                callback();
            });
        };
        Socket.onRefreshUsers = function (callback) {
            this.instance.on('REFRESH_USERS', function (data) {
                app.Server.setData(data);
                callback();
            });
        };
        Socket.onStartGame = function (callback) {
            this.instance.on('START_GAME', function (data) {
                app.Server.setData(data);
                callback();
            });
        };
        Socket.setPosition = function (tank) {
            this.instance.emit('SET_POSITION', {
                position: tank.getPosition()
            });
        };
        Socket.onPositionSended = function (callback) {
            this.instance.on('POSITION_SENDED', function (data) {
                callback(data);
            });
        };
        Socket.setTracer = function (tank) {
            this.instance.emit('SET_TRACER', {
                position: tank.getPosition()
            });
        };
        Socket.onTraceSended = function (callback) {
            this.instance.on('TRACE_SENDED', function (data) {
                callback(data);
            });
        };
        Socket.setFire = function (tank) {
            this.instance.emit('SET_FIRE', {
                position: {
                    x: src.Game.get().input.mousePointer.x,
                    y: src.Game.get().input.mousePointer.y
                }
            });
        };
        Socket.onFireSended = function (callback) {
            this.instance.on('FIRE_SENDED', function (data) {
                callback(data);
            });
        };
        Socket.setTankTouch = function (id, hit) {
            this.instance.emit('SET_TANK_TOUCH', {
                id: id,
                hit: hit
            });
        };
        Socket.onTankTouched = function (callback) {
            this.instance.on('TANK_TOUCHED', function (data) {
                callback({ id: data.id }, data.hit);
            });
        };
        Socket.setTankExplose = function () {
            this.instance.emit('SET_TANK_EXPLOSE');
        };
        Socket.onTankExplosed = function (callback) {
            this.instance.on('TANK_EXPLOSED', function (data) {
                callback(data);
            });
        };
        Socket.onRespawn = function (callback) {
            this.instance.on('RESPAWN', function (data) {
                app.Server.setData(data);
                callback();
            });
        };
        Socket.onTankRespawned = function (callback) {
            this.instance.on('TANK_RESPAWNED', function (data) {
                callback(data.user);
            });
        };
        Socket.onEndGame = function (callback) {
            this.instance.on('END_GAME', function (data) {
                callback(data.winner);
            });
        };
        Socket.onReturnToMenu = function (callback) {
            this.instance.on('RETURN_TO_MENU', function (data) {
                app.Server.setData(data);
                callback();
            });
        };
        return Socket;
    })();
    app.Socket = Socket;
})(app || (app = {}));
var app;
(function (app) {
    var User = (function () {
        function User() {
        }
        User.getId = function () {
            return app.Server.getUser().id;
        };
        User.getUsername = function () {
            return app.Server.getUser().username;
        };
        User.getTeam = function () {
            return app.Server.getUser().team;
        };
        User.getHealt = function () {
            return app.Server.getUser().healt;
        };
        User.getLife = function () {
            return app.Server.getUser().life;
        };
        User.setReady = function (ready) {
            app.Server.getUser().ready = ready;
        };
        User.isReady = function () {
            return app.Server.getUser().ready;
        };
        User.getPosition = function () {
            return app.Server.getUser().position;
        };
        return User;
    })();
    app.User = User;
})(app || (app = {}));
var app;
(function (app) {
    var Util;
    (function (Util) {
        var Hitter = (function () {
            function Hitter() {
                this.hitGroup = src.Game.get().add.group();
                var explosionAnimation = this.hitGroup.create(0, 0, 'tank-hit', 0, false);
                explosionAnimation.anchor.setTo(0.5, 0.5);
                explosionAnimation.animations.add('tank-hit');
            }
            Hitter.prototype.play = function (position) {
                var explosionAnimation = this.hitGroup.getFirstExists(false, true);
                explosionAnimation.reset(position.tank.x, position.tank.y);
                explosionAnimation.play('tank-hit', 30, false, true);
            };
            return Hitter;
        })();
        Util.Hitter = Hitter;
    })(Util = app.Util || (app.Util = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Util;
    (function (Util) {
        var LifeContainer = (function () {
            function LifeContainer(tank) {
                this.width = 200;
                this.height = 25;
                this.tank = tank;
                this.heightMax = this.tank.getHealth();
                this.lifeContainer();
                this.healtGraphic = src.Game.get().add.graphics(10, 10);
                this.healtGraphic.fixedToCamera = true;
                this.healtGraphic.cameraOffset.setTo(10, 10);
                this.lifeText = src.Game.get().add.text(10, 45, 'Vie: ', { font: "18px Arial", fill: "#ffffff" });
                this.lifeText.fixedToCamera = true;
                this.lifeText.cameraOffset.setTo(10, 45);
            }
            LifeContainer.prototype.refresh = function () {
                this.healtGraphic.clear();
                this.healtGraphic.beginFill(this.getLifeColor(), 0.5);
                this.healtGraphic.moveTo(1, 1);
                this.healtGraphic.lineTo(this.getLifeWidth() - 1, 1);
                this.healtGraphic.lineTo(this.getLifeWidth() - 1, this.height - 1);
                this.healtGraphic.lineTo(1, this.height - 1);
                this.healtGraphic.lineTo(1, 1);
                this.lifeText.setText('Vie: ' + (app.User.getLife() - 1));
            };
            LifeContainer.prototype.setTank = function (tank) {
                this.tank = tank;
            };
            LifeContainer.prototype.lifeContainer = function () {
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
            };
            LifeContainer.prototype.getLifeWidth = function () {
                return (this.width * this.tank.getHealth()) / this.heightMax;
            };
            LifeContainer.prototype.getLifeColor = function () {
                var color = 0x27ae60;
                if (this.tank.getHealth() <= (this.heightMax / 3)) {
                    color = 0xe74c3c;
                }
                else if (this.tank.getHealth() <= (this.heightMax / 2)) {
                    color = 0xe67e22;
                }
                return color;
            };
            return LifeContainer;
        })();
        Util.LifeContainer = LifeContainer;
    })(Util = app.Util || (app.Util = {}));
})(app || (app = {}));
var app;
(function (app) {
    var Util;
    (function (Util) {
        var Tracer = (function () {
            function Tracer() {
                this.traceGroup = src.Game.get().add.group();
                this.traceRate = 20;
                this.i = 0;
            }
            Tracer.prototype.set = function (position) {
                var trace = src.Game.get().make.sprite(position.tank.x, position.tank.y, 'tank-trace');
                trace.anchor.set(0.5, 0.5);
                trace.angle = position.tank.angle;
                this.traceGroup.add(trace);
            };
            Tracer.prototype.generate = function (position, callback) {
                if (this.i >= this.traceRate) {
                    this.i = 0;
                    this.set(position);
                    callback();
                }
                this.i++;
            };
            return Tracer;
        })();
        Util.Tracer = Tracer;
    })(Util = app.Util || (app.Util = {}));
})(app || (app = {}));
window.onload = function () {
    app.Server.start();
    app.Socket.start();
    app.Socket.connection();
    app.Socket.onConnection(function () {
        new app.App();
    });
};
