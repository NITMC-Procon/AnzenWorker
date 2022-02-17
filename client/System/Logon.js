import { SystemConfigs } from "./Desktop.js"
import { Socket } from './Network.js'


let loHtml = `
<style>

    .logon_container {
        width: 100%;
        height: 100%;
        cursor: default;
    }

    #anno {
        width: 50%;
        height: 100%;
        background-color: rgb(0, 132, 219);
        text-align: right;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #userselect {
        width: 50%;
        height: 100%;
        background-color: rgb(0, 132, 219);
        display: flex;

        text-align: left;
        /* justify-content: center; */
        align-items: center;
    }

    .users {
        width: 80%;
        text-align: center;
        display: block;
    }

    .user {
        width: 70%;
        max-width: 800px;
        height: 10%;
        background-color: rgb(0, 100, 190);
        max-height: 300px;
        min-height: 100px;
        display: flex;
        text-align: left;
        align-items: center;

    }

    img.userpic {
        object-fit: contain;
        width: 40%;
        height: 100px;
    }
</style>
<div class="logon_container">
    <div style="height: 90%;width: 100%; background-color: blue; display: flex;">
        <div id="anno">
            <div style="display: inline-block; width: 100%;">
                <div style="width: 100%;">
                    <div style="width: 90%; display: block; text-align: right;">
                        <div style="width: 100%;">
                            <img src="/images/logo.svg" width="40%" style="max-width: 200px;">
                        </div>
                        <span style="color: white">ログオンするユーザーを選択してください</span>
                    </div>
                </div>
                <!-- <div style="height: 100px;"></div> -->
            </div>
        </div>
        <div id="userselect">
            <div class="users" style="text-align: center;">
                <div id="user_admin" class="user">
                    <img src="/images/logon/beach_parasol.png" class="userpic">
                    <div style="display: inline; height: 100%; width: 60%;">
                        <span style="font-size: 1.3rem;">ルームに参加</span>
                    </div>
                </div>
                <div id="user_login" class="user">
                    <img src="/images/logon/animal_kaeru.png" class="userpic">
                    <div style="display: inline; height: 100%; width: 60%;">
                        <span style="font-size: 1.3rem;">ルームを作成</span>
                    </div>
                </div>
                <div id="user_debug" class="user">
                    <img src="/images/logon/mark_chuui.png" class="userpic">
                    <div style="display: inline; height: 100%; width: 60%;">
                        <span style="font-size: 1.3rem;">デバッグモード</span>
                    </div>
                </div>
                <div id="user_input" style="color: black;width: 70%;display: none;">
                    <div style="display: inline;">
                        <div style="width: 50%;text-align: right;display: inline-block;">
                            <div style="display: block;width: 100%;">
                                <span style="width: 6rem;display: inline-block;text-align: right;">ユーザー名:</span>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div style="display: block;width: 100%;">
                                <span style="width: 6rem;display: inline-block;text-align: right;">ルームID:</span>
                                <input type="text" id="room" name="room" required>
                            </div>
                            <div style="height: 1rem;"></div>
                            <div>
                                <button id="b_back" style="height: 2rem;">戻る</button>
                                <button id="b_start" style="height: 2rem;">開始</button>
                            </div>
                            <div>
                                <span id="room_message"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="height: 10%; width: 100%; background-color: rgb(0, 100, 255); display: flex;   align-items: center;">
        <div style="text-align: right; width: 100%;">
            <div style="width: 98%;">
                <button style="width: 50px;height: 50px;">？</button>
            </div>
        </div>
    </div>
</div>`

let container;
export function Logon(){
     container = document.getElementById('logon');
    container.style.width = "100%";
    container.style.height = "100vh";
    container.style.margin = "0px";
    container.style.padding = "0px";
    container.style.position = "absolute";
    container.style.zIndex = "999";

    container.innerHTML= loHtml;


    let dadmin = document.getElementById('user_admin');
    let dlogin = document.getElementById('user_login');
    let ddebug = document.getElementById('user_debug');
    let dinput = document.getElementById('user_input');


    let mode = "join";
    let bback = document.getElementById('b_back');
    let bstart = document.getElementById('b_start');

    bback.onclick = function(){
        dadmin.style.display= "";
        dlogin.style.display= "";
        ddebug.style.display= "";
        dinput.style.display = "none";

    }

    bstart.onclick = function(){
        let roomid = document.getElementById('room').value;
        let name = document.getElementById('name').value;

        room_button(mode,roomid,name);
    }

    dadmin.onclick = function () {
        dlogin.style.display = "none";
        ddebug.style.display = "none";
        dinput.style.display = "";
        mode = "join";
    }

    dlogin.onclick = function () {
        dadmin.style.display = "none";
        ddebug.style.display = "none";
        dinput.style.display = "";
        mode = "create";
    }
}

function room_button(str,roomid,username) {
    let success_flag = false
    const message = document.getElementById("room_message")
    const callbackfunc = (resp) => {
        if (!resp.roomres) {//ログイン成功時
            // //オーバーレイ非表示
            // let overlays = Array.from( document.getElementsByClassName('overlay') ) ;
            // overlays.forEach(e =>{
            //     e.classList.add('disabled')
            // })
            message.innerText = ""//警告メッセージ削除
            container.remove();
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