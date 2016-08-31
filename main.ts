
declare var io;

window.onload = () => {
    app.Server.start();
    app.Socket.start();
    app.Socket.connection();
    
    app.Socket.onConnection(() => {
        new app.App();
    });
};
