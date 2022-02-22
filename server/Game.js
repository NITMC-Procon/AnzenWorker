'use strict';

const RoomClass = require("./Room.js");

const SocketIO = require("socket.io");

// For Load balanser
const cluster = require("cluster");
const sticy = require('sticky-session');
const os = require("os");
const redis = require("socket.io-redis");

class Games{

    /** 
     * コンストラクタ。
     * Socketサーバの起動を行う。また、Redisで負荷分散を行う。そのため、複数のSocketサーバが起動する。
     * @constructor
     * @classdesc ゲームのサーバ起動、管理を行う。
     * @param {json} Config サーバの設定
     *  @param {http.Server} Config.server httpサーバ
     *  @param {int} Config.port httpサーバのポート番号
     *  @param {String} Config.redisIP RedisサーバのIPアドレス
     *  @param {int} Config.redisPort Redisサーバのポート番号
     * */
    constructor(Config){

        /** @type {SocketIO.Server} - socketio */
        this.io = new SocketIO.Server(Config.server,{serveClient: true});
        this.io.adapter(redis({host: Config.redisIP, port: Config.redisPort}));

        console.log("Listening port is %d", Config.port);
        const isWorker = sticy.listen(Config.server, Config.port);

        if(isWorker){
            console.log("[CLUSTER] Worker started");

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
    }

    /** 
     * @param {String} roomid - ルームID 
     * @param {SocketIO.Socket} socket
     * @returns {Room} - 作成されたルーム
     * */
    newGame(roomid,socket){
        let room = new RoomClass.Room(roomid,this)
        
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
        //socket.rooms で Set(2){ 'joer8EhcmAayFaDGAAAH', 'test' } みたいなmapが返ってくる
        //Set(n)からデータを得るために、...socket~で配列化 なんとなくGolangっぽい?
        //1つ目のデータは自分のsocket.idなので、2つ目を取得
        let roomid = [...socket.rooms.values()][1]

        //もしルームに入ってなければ(roomid==undefined)、socket.idを返すようにした
        return roomid?roomid:socket.id
    }
}

exports.Games = Games
