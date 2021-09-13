'use strict'
import { Dialog } from "../Dialog.js"
import { configs } from "../Desktop.js"

const html = `
<div style="display: flex;justify-content: center;width: 100%;">
    <img class="login-icon" style="max-width: 300px;" src="./images/login/logo.svg">
</div>
<div>
    <div class="input-area"><span style="width: 5em;">ユーザー名:</span><input type="text" id="user_name"></div>
    <div class="input-area"><span style="width: 5em;">ルームID:</span><input type="text" id="room_id"></div>
</div>
<p id="room_message" class="message" style="color: red;text-align:center"></p>
<div class="login-buttons">
    <button class="push" id="join_room">ルームに参加</button>
    <button class="push" id="create_room">ルームを作成</button>
</div>
`
const style = "width:35em;"

export class LoginWindow extends Dialog {
    constructor(parent) {
        super(html, "AnzenWorkerにログオン", parent, { style: style ,no_xbutton: true})
        this.bodyElem.lastElementChild.firstElementChild.addEventListener('click', () => { this.room_button("join") })
        this.bodyElem.lastElementChild.lastElementChild.addEventListener('click', () => { this.room_button("create") })
        this.drag.classList.add("login-window")

        /** @type {any} */ //Element型にはinnerTextがなくてIntellisenseがエラー吐いてめんどい
        this.roomid_input = document.getElementById("room_id")
        this.roomid_input.value = configs.room.roomid
    }
    room_button(str) {
        let success_flag = false
        let roomid = this.roomid_input.value
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
            return
        }
        if (str == "join") {
            window["socket"].emit("joinRoom", roomid, callbackfunc);
        } else if (str == "create") {
            window["socket"].emit("createRoom", roomid, callbackfunc);
        }
        configs.room.roomid = roomid
    }
}