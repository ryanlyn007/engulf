module.exports = class SocketIO {
    constructor(io) {
        this.namespace = io.of('/');
        this.listen();
    };
    listen() {
        this.namespace.on('connection', socket => { // Web Socket Connection
            socket.on('clientCallServerConnectionCheck', data => {
                socket.emit ('clientCallServerConnectionCheck', "success:" + new Date() );
            });
        });
    };
}

// function clientCallServerConnectionCheck(socket) {
//     socket.on('clientCallServerConnectionCheck', function(data) {
//         socket.emit ('clientCallServerConnectionCheck', "success" + new Date() );
//     });
// }
//
// io.sockets.on('connection', function (socket) { // Web Socket Connection
//
//     socket.on('example-ping', function(data) { // If we recieved a command from a client to start watering lets do so
//         console.log("ping server");
//
//         delay = data["duration"];
//
//         setTimeout(function(){    // Set a timer for when we should stop watering
//             socket.emit("example-pong");
//         }, delay*300);
//
//     });
//
//     clientCallServerConnectionCheck(socket);
// });
