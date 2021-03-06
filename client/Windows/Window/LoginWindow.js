'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../../System/System.js"
import { Socket } from '../../System/Network.js'

const html = `
<div style="display: flex;justify-content: center;width: 100%;">
    <img class="login-icon" style="max-width: 300px;" src="./images/login/logo.svg">
</div>
<div>
    <div class="input-area"><span style="width: 7em;">ユーザー名:</span><input type="text" id="user_name"></div>
    <div class="input-area"><span style="width: 7em;">ルームID:</span><input type="text" id="room_id"></div>
</div>
<p id="room_message" class="message" style="color: red;text-align:center"></p>
<div class="login-buttons">
    <button class="push" id="join_room">ルームに参加</button>
    <button class="push" id="create_room">ルームを作成</button>
</div>
`
const style = "width:35em;"

export class LoginWindow extends Window {
    constructor() {
        super(html, "AnzenWorkerにログオン", { style: style,no_xbutton: true, dialog:true})
        if(this.creationFailed)return
        
        this.bodyElem.lastElementChild.firstElementChild.addEventListener('click', () => { this.room_button("join") })
        this.bodyElem.lastElementChild.lastElementChild.addEventListener('click', () => { this.room_button("create") })
        this.window.classList.add("login-window")

        /** @type {HTMLInputElement} *///@ts-ignore
        this.roomid_input = document.getElementById("room_id")
        /** @type {HTMLInputElement} *///@ts-ignore
        this.username_input = document.getElementById("user_name")
        this.roomid_input.value = SystemConfigs.room.roomid
        this.username_input.value = SystemConfigs.room.username
    }
    room_button(str) {
        let success_flag = false
        let roomid = this.roomid_input.value
        let username = this.username_input.value
        const message = document.getElementById("room_message")
        const callbackfunc = (resp) => {
            if (!resp.roomres) {//ログイン成功時
                // //オーバーレイ非表示
                // let overlays = Array.from( document.getElementsByClassName('overlay') ) ;
                // overlays.forEach(e =>{
                //     e.classList.add('disabled')
                // })
                message.innerText = ""//警告メッセージ削除
                this.destroy()
            } else if (resp.roomres == -1) {
                message.innerText = "Room already exists or invalid!"//警告メッセージ
            } else if (resp.roomres == -2) {
                message.innerText = "Room does not exists or invalid!"//警告メッセージ
            }
        }
        if (roomid == "") {//ルームIDなければ
            callbackfunc(0)//とりあえず成功扱い、ルームには入らない
            SystemConfigs.room.roomid = ""
            return
        }
        if(SystemConfigs.room.status && SystemConfigs.room.roomid != roomid){//すでにゲーム始まってれば
            message.innerText = "すでにゲームが開始されています!"
            return
        }
        if(SystemConfigs.room.roomid == roomid){//すでに入ってる場所と同じなら
            callbackfunc(0)
            return
        }
        if (str == "join") {
            Socket.emit("joinRoom", {roomid:roomid,username:username}, callbackfunc);
        } else if (str == "create") {
            Socket.emit("createRoom", {roomid:roomid,username:username}, callbackfunc);
        }
        SystemConfigs.room.roomid = roomid
    }
}