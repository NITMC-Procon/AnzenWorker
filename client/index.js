import { Desktop } from './scene/Desktop.js';
import { CallWindow, SystemConfigs, Init, Stop } from './Desktop/Desktop.js'
import { Notify } from './Functions/notify.js';
import { Handlers, Connect_to_server, Socket } from './Functions/socket.js';

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

let host = window.document.location.host;   // .replace(/:.*/, '');
let ServerAddress = 'ws://' + host;         //  + ':8080';

//ロードされたらゲーム開始
window.addEventListener("load", () => {
    var game = new Phaser.Game(config);

    CallWindow("LoginWindow","Window_LoginWindow")//最初に呼ぶ

    Connect_to_server(ServerAddress)
    
    Handlers["gameInfo"] = (msg) => {
        switch (msg.status) {
            case "start":gamestart(msg); break;
            case "stop":gamestop(msg); break;
        }
    };
});


let stoptimer
function gamestart(msg){
    if(!SystemConfigs.room.status){//開始されてなければ
        Init()
        SystemConfigs.room.startat = msg.startat
        SystemConfigs.room.duration = msg.duration
        SystemConfigs.room.status=true
        stoptimer = setTimeout(gamestop, msg.duration);
    
        Notify("ゲームが開始されました")
    }
}

function gamestop(msg){
    if(SystemConfigs.room.status){//終了してなければ
        Stop()
        clearTimeout(stoptimer)
        SystemConfigs.room.status=false
        Notify("ゲームが終了しました")
        CallWindow("ResultWindow", "Window_ResultWindow")
    }
}