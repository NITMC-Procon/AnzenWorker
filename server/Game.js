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
     *  @param {int} Config.maxRoomIdLength ルームIDの最大入力文字数
     *  @param {int} Config.maxUserNameLength ユーザ名の最大入力文字数
     * */
    constructor(Config){

        /** 
         * socket.io
         * @type {SocketIO.Server}
         * */
        this.io = new SocketIO.Server(Config.server,{serveClient: true});
        this.io.adapter(redis({host: Config.redisIP, port: Config.redisPort}));
        
        console.log("Listening port is %d", Config.port);

        if( sticy.listen(Config.server, Config.port) ){
            console.log("[CLUSTER] Worker started");

            /**
             * ルームリスト(MAP)
             * @type {Map.<String,Room>}*/
            this.rooms = new Map();

            this.io.on("connection", socket => {

                socket.on("createRoom", (req, ack) => {
                    if(req.roomid.length >= Config.maxRoomIdLength || req.username.length >= Config.maxUserNameLength){
                        ack({roomres: -3});
                    }
                    else if(!this.isThereRoom(req.roomid)){
                        this.newGame(req.roomid, socket).Join(socket, req.username);
                        ack({roomres: 0});
                    }
                    else{
                        ack({roomres: -1});
                    }
                });

                socket.on("joinRoom", (req, ack) => {
                    if(req.roomid.length >= Config.maxRoomIdLength || req.username.length >= Config.maxUserNameLength){
                        ack({roomres: -3});
                    }
                    else if(this.isThereRoom(req.roomid)){
                        this.rooms.get(req.roomid).Join(socket, req.username);
                        ack({roomres: 0});
                    }
                    else{
                        ack({roomres: -2});
                    }
                });
            
                //socketにuuidを紐付け
                socket.on("regist-uuid", arg => {
                    socket["uuid"] = arg.uuid
                });
            
                //ack:コールバック
                socket.on("getGameInfo", (ack) => {
                    let roomid = this.getRoomidFromSocket(socket)
            
                    if(typeof ack != 'function')
                        return;
                    
                    if(!this.isThereRoom(roomid)){
                        ack({"status":"fail","message":"no such game"})
                    }else{
                        ack(this.rooms.get(roomid).getGameInfo(socket))
                    }
                });

                socket.on("setGameInfo", (arg, ack) => {
                    let roomid = arg.roomid || this.getRoomidFromSocket(socket)

                    if(typeof ack != 'function')
                        return;

                    if(!this.isThereRoom(roomid)){
                        ack({"status":"fail","message":"no such game"})
                    }else{
                        ack(this.rooms.get(roomid).setGameInfo(socket,arg))
                    }
                });

            });
        }
    }

    /** 
     * ゲームの生成
     * @param {String} roomid  ルームID 
     * @param {SocketIO.Socket} socket
     * @return {Room}  作成されたルーム
     * */
    newGame(roomid, socket){
        let room = new RoomClass.Room(roomid,this)
        
        this.rooms.set(roomid,room)
        room.owners.push({Name:"",SocketID:socket.id})
    
        return room
    }
    
    /** 
     * ゲームの終了
     * @param {String} roomid  ルームID */
    DeleteGame(roomid){
        if(this.isThereRoom(roomid)){
            this.rooms.delete(roomid)
        }else{
            console.log(`delete: ${roomid}: No such Room ID!`)
        }
    }

    /**
     * 指定されたルームIDがすでに存在するかを確認
     * @param {String} roomid  ルームID 
     * @return {boolean} すでに存在していればTrue、存在していなければFalse  */
    isThereRoom(roomid) {
        return this.rooms.has(roomid);
        //return this.io.sockets.adapter.rooms.has(roomid);
    }
    
    /** 
     * socketからルームIDを取得する
     * @param {SocketIO.Socket} socket
     * @return {socket.id} ルームに入っているならsocket.idを返す。それ以外はundefinedを返す。
     */
    getRoomidFromSocket(socket){
        // socket.rooms で Set(2){ 'joer8EhcmAayFaDGAAAH', 'test' } みたいなmapが返ってくる
        // Set(n)からデータを得るために、...socket~で配列化 なんとなくGolangっぽい?
        // 1つ目のデータは自分のsocket.idなので、2つ目を取得
        let roomid = [...socket.rooms.values()][1]

        // もしルームに入ってなければ(roomid==undefined)、socket.idを返す
        return roomid || socket.id
    }
}

exports.Games = Games
