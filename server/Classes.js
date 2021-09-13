'use strict';

/**
 * @typedef {import("http").Server} http.Server
 */

const SocketIO = require("socket.io")

class Room {
    /** 新しいルームを作成
     * @param {String} roomid - ルームID
     * @param {Games} parent - 親クラス
     */
    constructor(roomid,parent){
        /** @type {String} - ルームID */
        this.roomid = roomid
        /** @type {Games} - 親クラス */
        this.parent = parent
        /** @type {Boolean} - 状態 */
        this.status = false
    }

    /** socket(送信元)以外に送信
     * @param {SocketIO.Socket} socket 
     * @param {String} param
     * @param {Object} arg
     */
    Broadcast(socket,param,...arg){
        socket.broadcast.to(this.roomid).emit(param,...arg)
    }
    /** 全員に送信
     * @param {String} param
     * @param {Object} arg
     */
    SendToAll(param,...arg){
        this.parent.io.to(this.roomid).emit(param,...arg)
    }
    /** ルームに参加
     * @param {SocketIO.Socket} socket 
     */
    Join(socket){
        socket.join(this.roomid);
    }
    //ゲームの情報を返す
    getGameInfo(){
        let stat
        if(this.status){
            stat = "started"
        }else{
            stat = "stopped"
        }
        let res = {"status":stat,"roomid":this.roomid}
        return res
    }
    
    //ゲームの情報をセットする(GameStart,GameEnd,...etc)
    setGameInfo(arg){
        let res = {}
        if(arg.StartGame){
            if(!this.status){
                //{}にゲーム情報ぶち込む
                this.status=true
                res = {"status":"start","message":"game started"}
                this.SendToAll("gameInfo",res)
            }else{
                res = {"status":"started","message":"game already started"}
            }
        } else if(arg.StopGame){        
            if(this.status){
                this.status=false
                res = {"status":"stop","message":"game finished"}
                this.SendToAll("gameInfo",res)
            }else{
                res = {"status":"stopped","message":"game already finished"}
            }
        }
        return res
    }
}

/**コンストラクタ用コンフィグ
 * @typedef {Object} Config - Room型
 * @property {http.Server} server
 */

class Games{
    /** @param {Config} Config */
    constructor(Config){
        /** @type {SocketIO.Server} - socketio */
        this.io = new SocketIO.Server(Config.server,{serveClient: true});
        /** @type {Map.<String,Room>} - ルームのリスト(MAP) */
        this.rooms = new Map();
        this.io.on("connection", socket => {
            socket.on("createRoom", (roomid, ack) => {
                if(!this.isThereRoom(roomid)){
                    this.newGame(roomid).Join(socket);
                    ack({roomres: 0});
                }else{
                    ack({roomres: -1});
                }
            });
            socket.on("joinRoom", (roomid, ack) => {
                if(this.isThereRoom(roomid)){
                    this.rooms.get(roomid).Join(socket);
                    ack({roomres: 0});
                }else{
                    ack({roomres: -2});
                }
            });
            
            socket.on("taskresult", arg => {
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
                    res = this.rooms.get(roomid).getGameInfo()
                }
                if(typeof ack == 'function'){
                    ack(res)
                }
            });

            socket.on("setGameInfo", (arg,ack) => {
                let roomid=this.getRoomidFromSocket(socket)
                let res = {}
                if(!this.isThereRoom(roomid)){
                    res = {"status":"fail","message":"no such game"}
                }else{
                    res = this.rooms.get(roomid).setGameInfo(arg)
                }
                if(typeof ack == 'function'){
                    ack(res)
                }
            });
        });
    }

    /**
     * @param {SocketIO.Socket} socket 
     * @param {String} event
     * @param {(...args: any[]) => void} func
     */
    io_addEventListener(socket,event,func){
        socket.on(event,func)
    }

    /** 
     * @param {String} roomid - ルームID 
     * @returns {Room} - 作成されたルーム
     * */
    newGame(roomid){
        let room = new Room(roomid,this)
        this.rooms.set(roomid,room)
        return room
    }
    
    /** @param {String} roomid - ルームID */
    deleteGame(roomid){
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
}

exports.Games = Games