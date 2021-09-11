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
    window["CreateDraggableWindowFromHTML"] = CreateDraggableWindowFromHTML
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


// 例
// window["CreateDraggableWindowFromHTML"](`<div style="display: flex;align-items: center;justify-content: space-evenly;">
//              <input value="ゲーム開始" type="button" id="gamestart_button"></input>
//              <input value="ゲーム終了" type="button" id="gamestop_button"></input>
//              </div>`,
//     "title",{
//     xbutton: true
//   })
var windowindex = 0;//ウィンドウをドラッグするたびに増やす
function CreateDraggableWindowFromHTML(html,title,configs){
    let windowhtml = createElementFromHTML(`
    <div class="window" style="${(configs != null && configs.style)?configs.style:""}">
        <div class="window-titlebar">
            <span>${title}</span>
            ${(configs != null && configs.xbutton)?'<span class="Xbutton" onclick="this.parentElement.parentElement.remove()"></span>':''}
        </div>
        ${html}
    </div>`)
    let x;
    let y;
    const windows = document.getElementById("htmlwindows")
    let drag = windows.insertAdjacentElement('afterbegin',windowhtml)

    drag.style.top = Math.random()*(document.documentElement.clientHeight/2 - drag.clientHeight) + "px"
    drag.style.left = Math.random()*(document.documentElement.clientWidth/2 - drag.clientWidth) + "px"
    drag.style["z-index"] = ++windowindex;
    
    //イベントを吸収
    for (const eventName of ['mouseup','mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']){
        drag.addEventListener(eventName, e => e.stopPropagation(),{passive: true});
    }

    //ウィンドウ内をクリックしたら発火
    for (const eventName of ['mousedown', 'touchstart']){
        const clickwindow = (e) => {
            drag.style["z-index"] = ++windowindex;
        }
        drag.addEventListener(eventName,clickwindow);
    }
    const mdown = (e) => {
        drag.classList.add("dragging");
        var event = e;
        //タッチデイベントとマウスのイベントの差異を吸収
        if(e.type !== "mousedown") {
            event = e.changedTouches[0];
        }
        //要素内の相対座標
        x = event.pageX - drag.offsetLeft;
        y = event.pageY - drag.offsetTop;
        //ムーブイベントにコールバック
        drag.firstElementChild.addEventListener("mousemove", mmove, false);
        drag.firstElementChild.addEventListener("touchmove", mmove, false);
        
        //マウスボタンが離されたとき、またはカーソルが外れたとき発火
        drag.addEventListener("mouseup", mup, false);
        drag.addEventListener("touchend", mup, false);
        document.body.addEventListener("mouseleave", mup, false);
        document.body.addEventListener("touchleave", mup, false);
    }
    //マウスカーソルが動いたときに発火
    const mmove = (e) => {
        var event = e;
        if(e.type !== "mousemove") {
            event = e.changedTouches[0];
        }
        //フリックしたときに画面を動かさないようにデフォルト動作を抑制
        e.preventDefault();

        drag.style.top = event.pageY - y + "px";
        drag.style.left = event.pageX - x + "px";
    }
    //マウスボタンが上がったら発火
    const mup = (e) => {
        //ムーブベントハンドラの消去
        drag.removeEventListener("mouseup", mup, false);
        drag.removeEventListener("touchend", mup, false);
        drag.firstElementChild.removeEventListener("mousemove", mmove, false);
        drag.firstElementChild.removeEventListener("touchmove", mmove, false);
        //クラス名 .drag も消す
        drag.classList.remove("dragging");
    }
    
    //ウィンドウバークリックで発火
    drag.firstElementChild.addEventListener("mousedown", mdown, false);
    drag.firstElementChild.addEventListener("touchstart", mdown, false);
    return drag
}