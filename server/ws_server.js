'use strict';

const e = require('cors');

// TODO: DB desu
//const db = require('./db.js');
var io = require('socket.io')(null, {serverClient: true});;

var games = [];

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
        
        socket.on("regist-uuid", arg => {//socketにuuidを紐付け
            socket["uuid"] = arg.uuid
        });
        
        socket.on("getGameInfo", (ack) => {//ack:コールバック関数
            var res = getGameInfo(socket)
            if(typeof ack == 'function'){
                ack(res)
            }else{
                socket.emit("gameInfo",res)
            }
        });
        
        socket.on("setGameInfo", (arg,ack) => {
            var res = setGameInfo(socket,arg)
            if(typeof ack == 'function'){
                ack(res)
            }
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

//ゲームの情報を返す
function getGameInfo(socket){
    let roomid = getRoomidFromSocket(socket)
    /*
    ゲーム情報:
        roomid

        ...etc
    */
    let res = {"status":"success","roomid":roomid}
    return res
}

//ゲームの情報をセットする(GameStart,GameEnd,...etc)
function setGameInfo(socket,arg){
    let roomid = getRoomidFromSocket(socket)
    let res = {}
    /*  arg
    {
        "StartGame":true,
        "StopGame":true,
    }
    */
    if(arg.StartGame){
        if(!games[roomid]){
            //{}にゲーム情報ぶち込む
            games[roomid] = {}
            res = {"status":"start","message":"game started"}
        }else{
            res = {"status":"start","message":"game already started"}
        }
    } else if(arg.StopGame){        
        if(games[roomid]){
            delete games[roomid]
            res = {"status":"stop","message":"game finished"}
        }else{
            res = {"status":"stop","message":"game already finished"}
        }
    }
    socket.broadcast.to(roomid).emit("gameInfo", res);
    return res
}

function getRoomidFromSocket(socket){
    let roomid = [...socket.rooms.values()][1]
    //socket.rooms で Set(2){ 'joer8EhcmAayFaDGAAAH', 'test' } みたいなmapが返ってくる
    //Set(n)からデータを得るために、...socket~で配列化 なんとなくGolangっぽい?
    //1つ目のデータは自分のsocket.idなので、2つ目を取得

    return roomid?roomid:socket.id
    //もしルームに入ってなければ(roomid==undefined)、socket.idを返すようにした
}