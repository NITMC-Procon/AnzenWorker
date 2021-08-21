'use strict';
// TODO: DB desu
//const db = require('./db.js');
var io;

exports.startSocketServer = function(httpServer){
    io = require('socket.io')(httpServer, {serverClient: true});

    /* Serverはconnectじゃなくてconnectionらしい*/
    io.on("connection", socket => {
        doConnect(socket);

        socket.on("changeUUID", uuid => {
            changeUUID(socket, uuid);
        });

        socket.on("createRoom", arg => {
            socket.join("Droom");
            createRoom(socket, arg);
        });
        
        socket.on("joinRoom", arg => {
            joinRoom(socket, arg);
            console.log(io.sockets.adapter.rooms);
        });

        socket.on("message", arg => {
            doMessage(socket, arg);
        });

    });
}


//TODO: 関数名変える(doはないぞー)
function doConnect(socket) {
    console.log("Client connect: " + socket.id)
  //  socket.emit('updateUUID', {id: socket.id});
}

function changeUUID(socket, uuid) {
    console.log("UPDATE UUID: " + uuid);
    socket.id = uuid;
}

function createRoom(socket, arg) {
    var name = arg;
    
    if(isThereRoom(name)) {
        // TODO: Upload DB? ,,
        console.log("Create room: " + name);
        joinRoom(socket, name);
    }
    else {
        console.log("Room name already exists or invalid: " + name);        
        return;
    }

}

function joinRoom(socket, arg) {
    console.log('Join Room: ' + arg);
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
