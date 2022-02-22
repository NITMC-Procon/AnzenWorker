'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../../System/System.js"
import { Socket, Handlers } from '../../System/Network.js'
import { Notify } from "../../Functions/notify.js"

const html = `<br>
<div style="text-align: center;">
    <span>ゲーム時間(秒)</span><input type="number" value="300" min="30" max="1200">
    <br><br>
</div>
<div style="display: flex;align-items: center;justify-content: space-evenly;">
    <input value="ゲーム開始" type="button" id="gamestart_button"></input>
    <input value="ゲーム終了" type="button" id="gamestop_button"></input>
</div><p style="text-align: center"></p>`
const style="width:20em;"

export class GameManager extends Window{
    constructor(){
        super(html,"ゲームマネージャー",{style:style})
        if(this.creationFailed)return

        this.bodyElem.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.addEventListener('click',() => {this.game_button("start")})
        this.bodyElem.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild.addEventListener('click',() => {this.game_button("stop")})
    }
    game_button(stat){
        /** @type {HTMLInputElement} *///@ts-ignore
        const textarea = this.bodyElem.lastElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        const durationarea = this.bodyElem.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling
        const callbackfunc = (resp) => {
            //resp: {"status":"success","message":"game started"}

            textarea.innerText = `ステータス:${resp.status}\nメッセージ: ${resp.message}`
        }
        
        //@ts-ignore
        let duration = 1000 * durationarea.value || 1000 * 60 * 10 //10分
        if(duration < 30000 || duration > 1200000){//不正だったら(30秒以下、20分以上)
            duration = 1000 * 60 * 10
            Notify("ゲーム時間が不正です。")
        }
        if (!SystemConfigs.room.roomid){//roomidがない => ローカルゲーム
            let startat = Date.now()
            let res = {}
            if (stat == "start"){
                res = {"status":"start","message":"game started(local)","startat":startat,"duration":duration,"localgame":true}
            }else if (stat=="stop"){
                res = {"status":"stop","message":"game finished(local)"}
            }
            Handlers["gameInfo"](res)
            callbackfunc(res)
            return
        }
        if (stat == "start"){
            Socket.emit("setGameInfo",{"StartGame":true,"duration":duration},callbackfunc)
        }else if (stat=="stop"){
            Socket.emit("setGameInfo",{"StopGame":true},callbackfunc)
        }
    }
}