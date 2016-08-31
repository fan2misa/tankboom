
namespace src {

    export class Parameter {

        private static data: any;

        public static init(): void {
            this.data = {
                "sceneWidth": 1120,
                "sceneHeight": 640,
                "margin": 50,
            };
        }

        public static get(key: string): any {
            return this.data[key];
        }
    }

}