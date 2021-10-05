import { Result } from "../../Desktop/Desktop.js"
import { Service } from "../ServiceClass.js"
import { SendTo,SentToMeHandler,Socket } from "../../Functions/socket.js"

export class WormVirus extends Service {//自己増殖型
    create(){
        this.timer = setInterval(this.emitter.bind(this), 1000*20);//20秒ごとに呼ぶ
        this.targets = []

        Result.Flag.push("WormVirus")

        Result.SecurityScore -= 100;

        Socket.emit("getGameInfo",(res)=>{//ターゲットをセット
            if(res.users){
                res.users.forEach((user)=>{
                    if(user.SocketID != res.myID) this.targets.push(user.SocketID)
                })
                console.log(this.targets)
            }
        })
    }
    destroy(){
        clearInterval(this.timer)
    }
    emitter(){
        if(Math.random()>0.6){//約1/3
            let index = Math.floor(Math.random() * this.targets.length)
            console.log("send to"+this.targets[index])
            SendTo(this.targets[index],{event:"virusAttack",arg:{
                name:"WormVirus"
            }})
            Result.Revenue -= 10;
        }
    }
}

SentToMeHandler["virusAttack"] = (arg)=>{
    VirusHandler(arg)
}

function VirusHandler(arg){//ウイルスが送られてきたとき、ここで判別する
    let targetService
    console.log(arg)
    switch(arg.name){
        case "WormVirus":{
            targetService = WormVirus
        }
    }
    new targetService()
}