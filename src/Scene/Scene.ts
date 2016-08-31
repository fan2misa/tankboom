
namespace src.Scene {
    
    export abstract class Scene {

        public abstract init(): void;

        public abstract start(): void;
        
        public abstract update(): void;
                
        public abstract render(): void;
    }
    
}
