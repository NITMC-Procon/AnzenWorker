'use strict';

/**
 * @typedef {import("http").Server} http.Server
 */

//const SocketIO = require("socket.io")


/**
 * @typedef {Object} User
 * @property {String} Name
 * @property {String} SocketID
 */

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
        /** @type {Array.<User>} */
        this.owners = [];
        /** @type {Array.<User>} */
        this.users = [];
        /** @type {NodeJS.Timeout} */
        this.stoptimer = null;
        // /** @type {Set.<String>} */
        // this.Clients = parent.io.sockets.adapter.rooms.get(roomid);
    }

    /**
     * @param {SocketIO.Socket} socket
     */
    addListeners(socket){
        socket.on("sendTo",(arg)=>{this.SendTo(arg.SocketID,arg.arg)})
    }

    /**
     * @param {SocketIO.Socket} socket
     */
    removeListeners(socket){
        socket.off("sendTo",(arg)=>{this.SendTo(arg.SocketID,arg.arg)})
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
    /** 特定の相手に送信
     * @param {String} destid
     */
    SendTo(destid,arg){
        this.parent.io.to(destid).emit("sentToMe",arg)
        console.log(arg,destid)
    }
    
    /** ルームに参加
     * @param {SocketIO.Socket} socket 
     * @param {String} username
     */
    Join(socket,username){
        let currentroom = this.parent.getRoomidFromSocket(socket)
        if( currentroom != socket.id){
            console.log("joined and leaved")
            this.parent.rooms.get(currentroom).Leave(socket);
        }
        socket.join(this.roomid);
        this.users.push({Name:username?username:"Anon",SocketID:socket.id})
        socket.once("disconnect",()=>{
            this.Leave(socket)
        })
        this.addListeners(socket)
    }
    /** ルームから離脱
     * @param {SocketIO.Socket} socket 
     */
    Leave(socket){
        socket.leave(this.roomid)
        this.users = this.users.filter((user)=> {
            return user.SocketID != socket.id;
        });
        this.owners = this.owners.filter((user)=> {
            return user.SocketID != socket.id;
        });
        if (this.users.length == 0){
            this.parent.DeleteGame(this.roomid)
        }
        this.removeListeners(socket)
    }
    /** ゲームの情報を返す
     * @param {SocketIO.Socket} socket 
     */
    getGameInfo(socket){
        let stat
        if(this.status){
            stat = "started"
        }else{
            stat = "stopped"
        }
        let res = {"status":stat,"roomid":this.roomid,"users":this.users,"myID":socket.id}
        return res
    }
    
    /** ゲームの情報をセットする(GameStart,GameEnd,...etc)
     * @param {SocketIO.Socket} socket 
     */
    setGameInfo(socket,info){
        if(JSON.stringify(this.owners.filter(user=>{return user.SocketID === socket.id}))==="[]"){//オーナーの一覧にいなければ
            return {"status":"failed","message":"You dont have permission"}
        }
        let res = {}
        let startat = Date.now()
        let duration = info.duration
        const timer = () =>{
            if(this.status){
                this.status=false
                let res = {"status":"stop","message":"game finished"}
                this.SendToAll("gameInfo",res)
            }
        }
        if(info.StartGame){
            if(!this.status){
                //{}にゲーム情報ぶち込む
                this.status=true
                res = {"status":"start","message":"game started","startat":startat,"duration":duration}
                this.SendToAll("gameInfo",res)
                this.stoptimer = setTimeout(timer, duration);
            }else{
                res = {"status":"started","message":"game already started"}
            }
        } else if(info.StopGame){
            if(this.status){
                this.status=false
                res = {"status":"stop","message":"game finished"}
                this.SendToAll("gameInfo",res)
                clearTimeout(this.stoptimer);
            }else{
                res = {"status":"stopped","message":"game already finished"}
            }
        }
        return res
    }
}
exports.Room = Room
