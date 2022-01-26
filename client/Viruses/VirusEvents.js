import { Result,RefreshDesktop, SystemConfigs } from "../System/Desktop.js"
import { Window } from "../Windows/Window.js"
import { Service } from "../Services/ServiceClass.js"
import { SendTo,SentToMeHandler,Socket } from "../System/Network.js"
import { Root } from '../System/FileSystem.js'

export class WormVirus extends Service {//自己増殖型
    create(){
        this.timer = setInterval(this.emitter.bind(this), 1000*20);//20秒ごとに呼ぶ
        this.targets = []

        if(!Result.Flag.includes("WormVirus"))Result.Flag.push("WormVirus")

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
            SendTo(this.targets[index],"virusAttack",{
                name:"WormVirus"
            })
            Result.Revenue -= 10;
        }
    }
}
export class RansomWare extends Window {//身代金要求ウィンドウ
    constructor(){
        let html = `
        <div inputwindow style="display:flex;flex-direction:column;margin:0.5em 1em">
            <div>
            <h1>あなたのコンピュータは全て暗号化されました。</h1>
            <p>私達は全てあなたの写真、銀行口座、連絡先のデータを保持しました。</p>
            <p>あなたには支払の義務があります: 2.0BitCoin</p>
            
            </div>
            <div style="display:flex;justify-content: space-around;">
                <button>支払わない</button>
                <button>支払う</button>
            </div>
        </div>
        <style>
        div[inputwindow] p{
            margin:0;
        }
        div[inputwindow] input{
            margin:2px auto;
            width:100%;
        }
        </style>
        `
        super(html,"支払いのオプション",{no_minimizebutton:true,no_maxmizebutton:true,no_resizable:true,window_id:"RansomWare",style:"background-color:red;color:white;height:20em"})
        if(this.creationFailed)return

        this.nobutton = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
        this.yesbutton = this.nobutton.nextElementSibling

        if(!SystemConfigs.Result.Flag.includes("RansomWare"))SystemConfigs.Result.Flag.push("RansomWare")
        this.encryptfiles(Root);
        RefreshDesktop()
        this.nobutton.addEventListener('click', (e) => {
            this.destroy();
        });
        this.yesbutton.addEventListener('click', (e) => {
            // if(Math.random()>0.3)// 約2/3
                this.decryptfiles(Root);
                RefreshDesktop()
            Result.Revenue -= 2000
            this.destroy();
        });
    }
    encryptfiles(dir){
        dir.children.forEach(item =>{
            if(item.isdir){
                //@ts-ignore
                this.encryptfiles(item)
            }else{
                if(typeof item["cryptedcontent"] == "undefined"){
                    item["cryptedcontent"] = item.content
                    delete item.content
                }
                if(typeof item["cryptedicon"] == "undefined"){
                    item["cryptedicon"] = item.icon
                    item.icon = "/images/file.svg"
                }
            }
        })
    }
    decryptfiles(dir){
        dir.children.forEach(item =>{
            if(item.isdir){
                //@ts-ignore
                this.decryptfiles(item)
            }else{
                if(typeof item["cryptedcontent"] != "undefined"){
                    item.content = item["cryptedcontent"]
                    delete item["cryptedcontent"]
                }
                if(typeof item["cryptedicon"] != "undefined"){
                    item.icon = item["cryptedicon"]
                    delete item["cryptedicon"]
                }
            }
        })
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