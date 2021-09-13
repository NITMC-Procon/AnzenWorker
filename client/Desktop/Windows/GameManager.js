'use strict'
import { Window } from "../Window.js"
import { configs } from "../Desktop.js"

const html = `<br>
<div style="display: flex;align-items: center;justify-content: space-evenly;">
<input value="ゲーム開始" type="button" id="gamestart_button"></input>
<input value="ゲーム終了" type="button" id="gamestop_button"></input>
</div><p style="text-align: center"></p>`
const style="width:20em;"

export class GameManager extends Window{
    constructor(parent){
        super(html,"ゲームマネージャー",parent,{style:style})
        document.getElementById("gamestart_button").onclick = () => {this.game_button("start")};
        this.bodyElem.firstElementChild.nextElementSibling.firstChild.addEventListener('click',() => {this.game_button("start")})
        this.bodyElem.firstElementChild.nextElementSibling.lastElementChild.addEventListener('click',() => {this.game_button("stop")})
    }
    game_button(stat){
        /** @type {any} */ //Element型にはinnerTextがなくてIntellisenseがエラー吐いてめんどい
        const textarea = this.bodyElem.lastElementChild
        const callbackfunc = (resp) => {
            //resp: {"status":"success","message":"game started"}

            textarea.innerText = `ステータス:${resp.status}\nメッセージ: ${resp.message}`
        }
        if (!configs.room.roomid){return}
        if (stat == "start"){
            window["socket"].emit("setGameInfo",{"StartGame":true},callbackfunc)
        }else if (stat=="stop"){
            window["socket"].emit("setGameInfo",{"StopGame":true},callbackfunc)
        }
    }
}