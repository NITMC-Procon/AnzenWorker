'use strict';
// TODO: DB desu
//const db = require('./db.js');
var io;
exports.startSocketServer = function(httpServer){
    io = require('socket.io')(httpServer, {serverClient: true});

    io.use((socket, next) => {
        //var id = generateUUID();
        var id = "This-is-test-UUID-123450";
        console.log('Generate UUID: ' + id);
        socket.id = id;
        next();
    });

    /* Serverはconnectじゃなくてconnectionらしい*/
    io.on("connection", socket => {
        doConnect(socket);
        console.log(socket.rooms);
        io.to(socket.id).emit('broadcast', "HELL, This is ABC");

        socket.on("changeUUID", uuid => {
            changeUUID(socket, uuid);
            console.log(socket.rooms);
            console.log(socket.id);
            console.log(io.sockets.adapter.rooms);
        });

        socket.on("createRoom", arg => {
            socket.join("HELL");
            createRoom(socket, arg);
        });
        
        socket.on("joinRoom", arg => {
            joinRoom(socket, arg);
            console.log(socket.rooms);
            console.log(io.sockets.adapter.rooms);
        });
        
        socket.on("message", arg => {
            doMessage(socket, arg);
        });

    });

 /*   io.of("/").adapter.on("create-room", room => {
        console.log("Create Room: " + room);
    });
    io.of("/").adapter.on("join-room", room => {
        console.log("join Room: " + room);
    });*/
}


//TODO: 関数名変える(doはないぞー)
function doConnect(socket) {
    console.log("Client connect: " + socket.id)
}

function changeUUID(socket, uuid) {
    console.log("UPDATE UUID: " + uuid);
    socket.id = uuid;
}

function createRoom(socket, arg) {
    var name = arg;
    
    if(isThereRoom(name)) {
        // TODO: Upload DB? ,,
        console.log("in function:Create room: " + name);
        joinRoom(socket, name);
    }
    else {
        console.log("Room name already exists or invalid: " + name);        
        return;
    }

}

function joinRoom(socket, arg) {
    console.log('in function: Join Room: ' + arg);
    socket.join(arg);
}

function leaveRoom(socket, arg) {
    console.log('Leave Room: ' + arg);
    // TODO: Remove room data?
    socket.leave(arg);
}

function isThereRoom(arg) {
    /** 
     * io.sockets.adapter.rooms is Map object.
     * It has room name and socket ID.
     * TODO: Get only room name
     */
//    return io.sockets.adapter.rooms.has(arg);
     getRoomName(io);
     return true;
}

function getRoomName(io) {
    console.log(io.sockets.adapter.rooms.keys());
}

function getUUIDs() {}

function doMessage(socket, message){
    console.log("Catch message: " + message);
    broadcastMessage(socket, message);   
}

function broadcastMessage(socket, message) {
    try{
        var json = JSON.parse(message.toString());
        console.log(json);

        if(json.task.broadcast == null)
            return;

        json.task.broadcast.forEach(event => {
            socket.broadcast.emit('broadcast', JSON.stringify(event));
        });

    }catch (e) {
        console.log('invalid json: ' + message);
        return;
    }
}

//TODO: Delete below function
function generateUuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}
