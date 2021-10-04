'use strict';

/**
 * @typedef {import("http").Server} http.Server
 */

const RoomClass = require("./Room.js");

const SocketIO = require("socket.io")

// Redis adapter and emitter
// For Load balanser
const { RedisAdapter } = require("@socket.io/redis-adapter");
const { RedisEmitter } = require("@socket.io/redis-emitter");
const { RedisClient } = require("redis");


/**コンストラクタ用コンフィグ
 * @typedef {Object} Config - Room型
 * @property {http.Server} server
 *
 * @typedef {Object} redisConf -Json
 * @property {redisConf.hostname} - Redis's host name
 * @property {redisConf.redisPort} - Redis's port
 */

class Games{
    /** @param {Config} Config */
    constructor(Config, redisConf){
        /** @type {SocketIO.Server} - socketio */
        this.io = new SocketIO.Server(Config.server,{serveClient: true});

        this.connectRedisAdapter(this.io, redisConf.hostname, redisConf.port);

        /** @type {Map.<String,Room>} - ルームのリスト(MAP) */
        this.rooms = new Map();
        this.io.on("connection", socket => {
            socket.on("createRoom", (req, ack) => {
                if(!this.isThereRoom(req.roomid)){
                    this.newGame(req.roomid,socket).Join(socket,req.username);
                    ack({roomres: 0});
                }else{
                    ack({roomres: -1});
                }
            });
            socket.on("joinRoom", (req, ack) => {
                if(this.isThereRoom(req.roomid)){
                    this.rooms.get(req.roomid).Join(socket,req.username);
                    ack({roomres: 0});
                }else{
                    ack({roomres: -2});
                }
            });
            
            socket.on("regist-uuid", arg => {//socketにuuidを紐付け
                socket["uuid"] = arg.uuid
            });
            
            socket.on("getGameInfo", (ack) => {//ack:コールバ
                let roomid=this.getRoomidFromSocket(socket)
                let res = {}
                if(!this.isThereRoom(roomid)){
                    res = {"status":"fail","message":"no such game"}
                }else{
                    res = this.rooms.get(roomid).getGameInfo(socket)
                }
                if(typeof ack == 'function'){
                    ack(res)
                }
            });

            socket.on("setGameInfo", (arg,ack) => {
                let roomid=arg.roomid||this.getRoomidFromSocket(socket)
                let res = {}
                if(!this.isThereRoom(roomid)){
                    res = {"status":"fail","message":"no such game"}
                }else{
                    res = this.rooms.get(roomid).setGameInfo(socket,arg)
                }
                if(typeof ack == 'function'){
                    ack(res)
                }
            });
        });
    }

    /** 
     * @param {String} roomid - ルームID 
     * @param {SocketIO.Socket} socket
     * @returns {Room} - 作成されたルーム
     * */
    newGame(roomid,socket){
        let room = new Room(roomid,this)
        this.rooms.set(roomid,room)
        room.owners.push({Name:"",SocketID:socket.id})
        return room
    }
    
    /** @param {String} roomid - ルームID */
    DeleteGame(roomid){
        if(this.rooms.has(roomid)){
            this.rooms.delete(roomid)
        }else{
            console.log(`delete: ${roomid}: no such room!`)
        }
    }

    /** @param {String} roomid - ルームID */
    isThereRoom(roomid) {
        return this.rooms.has(roomid);
        //return this.io.sockets.adapter.rooms.has(roomid);
    }
    
    /** @param {SocketIO.Socket} socket - ルームID */
    getRoomidFromSocket(socket){
        let roomid = [...socket.rooms.values()][1]
        //socket.rooms で Set(2){ 'joer8EhcmAayFaDGAAAH', 'test' } みたいなmapが返ってくる
        //Set(n)からデータを得るために、...socket~で配列化 なんとなくGolangっぽい?
        //1つ目のデータは自分のsocket.idなので、2つ目を取得
        return roomid?roomid:socket.id
        //もしルームに入ってなければ(roomid==undefined)、socket.idを返すようにした
    }

    connectRedisAdapter(io,hostname, port){
        const pubClient = RedisClient({host: hostname, port: port});
        const subClient = pubClient.duplicate();

        io.adapter(createAdapter(pubClient,subClient));
    }
}

exports.Games = Games
