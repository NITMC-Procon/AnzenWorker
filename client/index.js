import { SystemConfigs, InitGame, StopGame, Boot } from './System/Desktop.js'
import { Notify } from './Functions/notify.js';
import { Handlers, InitSocket, Socket } from './System/Network.js';
import { LoginWindow } from './Windows/Window/LoginWindow.js'
import { ResultWindow } from './Windows/Window/ResultWindow.js'
import { GameManager } from './Windows/Window/GameManager.js';

let host = window.document.location.host;   // .replace(/:.*/, '');
let protocol = window.document.location.protocol == "https:" ?'wss://':'ws://'
let ServerAddress = protocol + host;         //  + ':8080';

//ロードされたらゲーム開始
window.addEventListener("load", () => {
    const bootwindow = document.getElementById("bootwindow")
    setTimeout(() => {
        bootwindow.classList.add("hidden")
        Boot()
    
        new LoginWindow()
        new GameManager()
    
        InitSocket(ServerAddress)
        
        Handlers["gameInfo"] = (msg) => {
            switch (msg.status) {
                case "start":gamestart(msg); break;
                case "stop":gamestop(msg); break;
            }
        };
    }, 1000);
    
    const backgrounds = [
        "/images/backgrounds/hill.svg",
        "/images/backgrounds/blue.svg",
        "/images/backgrounds/orange.svg",
    ]
    let index = 0
    setInterval(() => {//壁紙変更
        index++
        if(index >= backgrounds.length)index = 0

        setbackground(backgrounds[index])
    }, 1000*60);
});

function setbackground(str){
    const desktop = document.getElementById("desktop")
    desktop.style.backgroundImage="url("+ str +")"
}

let stoptimer
function gamestart(msg){
    if(!SystemConfigs.room.status){//開始されてなければ
        InitGame()
        SystemConfigs.room.startat = msg.startat
        SystemConfigs.room.duration = msg.duration
        SystemConfigs.room.status=true
        stoptimer = setTimeout(gamestop, msg.duration);
    
        Notify("ゲームが開始されました")
    }
}

function gamestop(msg){
    if(SystemConfigs.room.status){//終了してなければ
        StopGame()
        clearTimeout(stoptimer)
        SystemConfigs.room.status=false
        Notify("ゲームが終了しました")
        new ResultWindow()
    }
}