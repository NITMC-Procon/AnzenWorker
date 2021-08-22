'use strict';
// TODO: DB desu
//const db = require('./db.js');
var io;

exports.startSocketServer = function(httpServer){
    io = require('socket.io')(httpServer, {serverClient: true});

 /*   io.use((socket, next) => {
        //var id = generateUUID();
        var id = "This-is-test-UUID-123450";
        console.log('Generate UUID: ' + id);
        socket.id = id;
        next();
    });
    */

    /* Serverはconnection*/
    io.on("connection", socket => {
        doConnect(socket);

        //TODO: I will iziziziziz... 
/*        socket.on("changeUUID", uuid => {
            changeUUID(socket, uuid);
            console.log(socket.id);
        });*/

        socket.on("createRoom", (arg, ack) => {
            var res = createRoom(socket, arg);
            socket.emit("room-msg", {roomres: res});

            console.log(io.sockets.adapter.rooms);
            ack({roomres: res})
        });
        
        socket.on("joinRoom", (arg, ack) => {
            var res = joinRoom(socket, arg);
            socket.emit("room-msg", {roomres: res});
            
            console.log(io.sockets.adapter.rooms);
            ack({roomres: res})
        });
        
        socket.on("message", arg => {
            doMessage(socket, arg);
        });

    });

}


//TODO: 関数名変える(doはないぞー)
function doConnect(socket) {
    console.log("Client connect: " + socket.id)
}

function changeUUID(socket, uuid) {
    console.log("UPDATE UUID: " + uuid);
    socket.id = uuid;
}


/**
 *
 * >console.log(io.sockets.adapter.rooms);
 * Map(3) {
 *  'THFRxLV7n2TjHyrOAAAH' => Set(1) { 'THFRxLV7n2TjHyrOAAAH' },
 *  'Hroom' => Set(2) { 'THFRxLV7n2TjHyrOAAAH', 'iZgUrywrlbzInBCIAAAL' },
 *  'iZgUrywrlbzInBCIAAAL' => Set(1) { 'iZgUrywrlbzInBCIAAAL' }
 * }
 *
 *  'Hroom' => Set(2) { 'THFRxLV7n2TjHyrOAAAH', 'iZgUrywrlbzInBCIAAAL' },
 *                       ^~~~~~~~~~~~~~~~~~~~ He create this room.
 */
function createRoom(socket, arg) {
    var name = arg;
    
    if(!isThereRoom(name)) {
        // TODO: Upload DB? ,,
        console.log("Create Room: " + name);
        socket.join(arg);
        return 0;
    }
    else {
        console.log("Room name already exists or invalid: " + name);
        return -1;
    }
}

function joinRoom(socket, arg) {
    var name = arg;
    
    if(isThereRoom(name)) {
        // TODO: Upload DB? ,,
        console.log("Join Room: " + name);
        socket.join(name);
        return 0;
    }
    else {
        console.log("Room name not exists or invalid: " + name);
        return -2;
    }
}

function isThereRoom(arg) {
    /** 
     *
     * io.sockets.adapter.rooms is Map object.
     * It has room name and socket ID.
     *
     */
    //return io.sockets.adapter.rooms.keys();
    return io.sockets.adapter.rooms.has(arg);
}

function leaveRoom(socket, arg) {
    console.log('Leave Room: ' + arg);
    // TODO: Remove room data?
    socket.leave(arg);
}

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
