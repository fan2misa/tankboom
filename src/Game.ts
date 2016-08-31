
namespace src {

    export class Game {

        private static phaserGame: Phaser.Game;

        public static get() {
            return this.phaserGame;
        }

        public static run(width: number, height: number, data: any) {
            width = null !== width ? width : window.outerWidth;
            height = null !== height ? height : window.outerHeight;
            this.phaserGame = new Phaser.Game(width, height, Phaser.CANVAS, 'content', {
                preload: data.preload,
                create: data.create,
                update: data.update,
                render: data.render
            });
        }
    }

}
