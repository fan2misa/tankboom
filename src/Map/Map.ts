
namespace src.Map {
    
    export abstract class Map {

        public static map: Phaser.Tilemap;

        public static layerBackground: Phaser.TilemapLayer;
        
        public static layerWall: Phaser.TilemapLayer;

        public static preload(): void {
            src.Game.get().load.image('tileset', 'img/tileset/tileset.png');
            src.Game.get().load.tilemap('map1', 'tilemaps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
        }

        public static init(map: string): void {
            src.Game.get().world.setBounds(-1000, -1000, 2000, 2000);
            this.map = src.Game.get().add.tilemap(map);
            this.map.addTilesetImage('tileset');

            this.layerBackground = this.map.createLayer('Background');
            this.layerBackground.resizeWorld();

            this.layerWall = this.map.createLayer('Wall');
            this.layerWall.resizeWorld();

            this.map.setCollision(1, true, this.layerWall);
        }
        
        public static getPositionByPoint(point: any): any {
            return {
                x: point.x * this.map.tileWidth + (this.map.tileWidth / 2),
                y: point.y * this.map.tileHeight + (this.map.tileHeight / 2),
                angle: point.angle
            };
        }
        
        public static getTileWidth(): number {
            return this.map.tileWidth;
        }
        
        public static getTileHeight(): number {
            return this.map.tileHeight;
        }
        
        public static getWall(): Phaser.TilemapLayer {
            return this.layerWall;
        }

    }
}
