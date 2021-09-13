import { Desktop } from './scene/Desktop.js';
import { CallWindow } from './Desktop/Desktop.js'
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
        console.log("status changed: " + JSON.stringify(msg));
        switch (msg.status) {
            case "start": Notify("ゲームが開始されました"); break;
            case "stop":Notify("ゲームが終了しました"); break;
        }
    };
});