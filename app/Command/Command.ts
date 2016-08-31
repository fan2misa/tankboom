
namespace app.Command {

    export class Command {

        private cursors: Phaser.CursorKeys;

        private buttonUp: Phaser.Key;
        
        private buttonDown: Phaser.Key;
        
        private buttonLeft: Phaser.Key;
        
        private buttonRight: Phaser.Key;

        private buttonFire: Phaser.Key;
                
        private mouseButtonLeftUped: boolean;

        public constructor() {
            this.mouseButtonLeftUped = true;
            this.cursors = src.Game.get().input.keyboard.createCursorKeys();
            this.buttonUp = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.Z);
            this.buttonDown = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.S);
            this.buttonLeft = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.Q);
            this.buttonRight = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.D);
            this.buttonFire = src.Game.get().input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
        }

        public up() {
            return this.cursors.up.isDown || this.buttonUp.isDown;
        }
        
        public down() {
            return this.cursors.down.isDown || this.buttonDown.isDown;
        }

        public left() {
            return this.cursors.left.isDown || this.buttonLeft.isDown;
        }

        public right() {
            return this.cursors.right.isDown || this.buttonRight.isDown;
        }

        public space() {
            return this.buttonFire.isDown;
        }
        
        public leftClick() {
            if (this.mouseButtonLeftUped && src.Game.get().input.activePointer.leftButton.isDown) {
                this.mouseButtonLeftUped = false;
                return true;
            } else if (src.Game.get().input.activePointer.leftButton.isUp) {
                this.mouseButtonLeftUped = true;
            }
            return false;
        }
    }

}
