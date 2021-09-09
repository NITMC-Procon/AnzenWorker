import { Desktop } from './scene/Desktop.js';

//ゲームの基本設定
var config = {
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.RESIZE,//リサイズされても最大まで描画
        parent: 'game',
    },
    scene: [
        Desktop
    ],
    antialias: false
};


//ロードされたらゲーム開始
window.addEventListener("load", () => {
    var game = new Phaser.Game(config);
    
    document.getElementById("join_room").onclick = () => {room_button("join")}
    document.getElementById("create_room").onclick = () => {room_button("create")}
    document.getElementById("gamestart_button").onclick = () => {game_button("start")}
    document.getElementById("gamestop_button").onclick = () => {game_button("stop")}
    let overlays = Array.from( document.getElementsByClassName('overlay') ) ;
    overlays.forEach(element => {
        for (const eventName of ['mouseup','mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']){
            element.addEventListener(eventName, e => e.stopPropagation(),{passive: true});
        }
    });

    Array.from( document.getElementsByClassName('Xbutton') ).forEach(elem => {
        
        elem.addEventListener('click',()=>{
            elem.parentElement.parentElement.parentElement.classList.add("disabled")
        })
    })
    window["notify"] = notify
});


function room_button(str) {
    let success_flag = false
    let roomid = document.getElementById("room_id").value
    const message = document.getElementById("room_message")
    const callbackfunc = (resp) => {
        if(!resp.roomres) {//ログイン成功時
            // //オーバーレイ非表示
            // let overlays = Array.from( document.getElementsByClassName('overlay') ) ;
            // overlays.forEach(e =>{
            //     e.classList.add('disabled')
            // })
            document.getElementById("login-window").classList.add('disabled')

            message.innerText = ""//警告メッセージ削除
        }else if(resp.roomres == -1){
            message.innerText = "Room already exists or invalid!"//警告メッセージ
        }else if(resp.roomres == -2){
            message.innerText = "Room does not exists or invalid!"//警告メッセージ
        }
    }

    if(roomid == ""){//ルームIDなければ
        callbackfunc(0)//とりあえず成功扱い、ルームには入らない
        return
    }
    if(str == "join"){
        window["socket"].emit("joinRoom", roomid,callbackfunc);
    }else if(str == "create"){
        window["socket"].emit("createRoom", roomid,callbackfunc);
    }
}

function game_button(stat){
    const callbackfunc = (resp) => {
        //resp: {"status":"success","message":"game started"}
    }
    if (stat == "start"){
        window["socket"].emit("setGameInfo",{"StartGame":true},callbackfunc)
    }else if (stat=="stop"){
        window["socket"].emit("setGameInfo",{"StopGame":true},callbackfunc)
    }
}

// 構文
// notify(text message,[option])

// 例
// window["notify"]("message",{
//     callback: (args)=>{alert(args)},
//     args:["test"],
//     style: "background-color: white; color: red;"
//   })
function notify(text,option){
    const notifyarea = document.getElementById("notification_area")
    let style=""
    if(option && option.style) style=option.style
    let notifytext = createElementFromHTML(`<div class="notification" style="${style}"><p>${text}</p></div>`)

    let notify = notifyarea.insertAdjacentElement('afterbegin',notifytext)
    const clickfunc = () =>{
        notify.classList.remove("show")
        setTimeout(()=>{
            notify.remove()
        },600)
        if(option && typeof option.callback == 'function') option.callback(...option.args);
    }
    setTimeout(()=>{
        notify.classList.add("show")
    },100)
    setTimeout(clickfunc,8000)

    notify.addEventListener('click',clickfunc)
    
    //クリック透過無効化
    for (const eventName of ['mouseup','mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']){
        notify.addEventListener(eventName, e => e.stopPropagation(),{passive: true});
    }
}

function createElementFromHTML(html){
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}