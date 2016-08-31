
namespace src.Map {

    export class Point {

        private x: number;

        private y: number;

        private angle: number;

        public constructor(point: any) {
            this.x = point.x * src.Map.Map.getTileWidth() + (src.Map.Map.getTileWidth() / 2);
            this.y = point.y * src.Map.Map.getTileHeight() + (src.Map.Map.getTileHeight() / 2);
            this.angle = this.generateAngle(point.angle);
        }

        public getX(): number {
            return this.x;
        }

        public getY(): number {
            return this.y;
        }
        
        public getAngle(): number {
            return this.angle;
        }

        private generateAngle(angle: string): number {
            switch (angle) {
                case 'west':        return 0;
                case 'west-south':  return 45;
                case 'south':       return 90;
                case 'south-east':  return 135;
                case 'east':        return 180;
                case 'east-north':  return 225;
                case 'north':       return 270;
                case 'north-west':  return 315;
            }
        }
    }
}