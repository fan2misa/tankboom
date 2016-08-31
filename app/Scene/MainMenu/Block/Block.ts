
namespace app.Scene.MainMenu.Block {
    
    export abstract class Block {
        
        public abstract displayUsers(): void;
        
        public abstract removeAllUsers(): void;
        
        public abstract destroy(): void;
        
    }
    
}