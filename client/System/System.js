import { Folder, File, Link, Root } from './FileSystem.js'
import { Handlers, InitSocket, Socket } from './Network.js'
import { RefreshTaskbar,RefreshDesktop,WindowManager,InitParameters } from './Desktop.js'

import { MailReciever } from '../Services/Service/MailReciever.js'
import { JobReciever } from '../Services/Service/JobReciever.js'
import { Notify } from '../Functions/notify.js';
import { ResultWindow } from '../Windows/Window/ResultWindow.js'
import { GameManager } from '../Windows/Window/GameManager.js';
import { InitWizard } from '../Windows/Window/InitWizard.js';
import { Logon } from './Logon.js';

const User_Name = "ANZEN"

//ココに最初から動かすバックグラウンドサービスのリストを追加していく
const systemServiceList = [
    MailReciever,
    JobReciever,
]

export let GameTimer

export let Task = {
    CompletedTask: [],
    SucceedTask: [],
    FailedTask: [],
    Complete: Task_Complete,
    IsCompleted: Task_IsCompleted,
    EmitResult: Task_EmitResult
}

/**
 * @typedef {Object} Package  - Package型
 * @property {String} Name    - アプリ名
 * @property {Object} Constructor  - アプリのクラス
 * @property {String} Iconurl - アイコンのURL
 * @property {Boolean} [AdminOnly = false] - 管理者用アプリ
 */
export let Packages = {
    /**@type {Array<Package>} */
    List: [],
    Install: package_Install,
    Uninstall: package_Uninstall
}

export let Result = {
    Revenue: 0,
    SecurityScore: 0,
    Flag: [],
}

export let Joblist = []

export let SystemConfigs = {
    "installed_software": [],      // アプリストアから入れたソフト
    room: {
        roomid: "",
        username: "名無しの社員さん",
        users: [],
        myID: "",        // 自分のソケットID
        status: false,
        startat: 0,      // 開始時刻
        duration: 0,     // ゲームの長さ(ms)
    },
    connected_wifi: [],
    Task: Task,
    Result: Result,
    JOblist:Joblist,
    GameTimer:GameTimer,
    Packages: Packages,

    isWizardClosed: false
}

/**
 * @param {String} name    - アプリ名
 * @param {String} iconurl - アイコンのURL
 * @param {Object} func  - アプリのクラス
 */
function package_Install(name, iconurl, func) {
    SystemConfigs.Packages.List.push({Name:name,Constructor:func,Iconurl:iconurl})
    /**@type {Folder} *///@ts-ignore
    let desktopfolder = Root.GetPath(`/Users/${User_Name}/Desktop/`)
    /**@type {Folder} *///@ts-ignore
    let progfolder = Root.GetPath(`/Programs/`)

    let tmp = new File(progfolder, name)
    tmp.icon = iconurl
    tmp.content = func
    new Link(desktopfolder, name, tmp).icon = iconurl
}

function package_Uninstall(name) {
    SystemConfigs.Packages.List = SystemConfigs.Packages.List.filter((item) => {
        return item.Name !== name
    })
    /**@type {Folder} *///@ts-ignore
    let desktopfolder = Root.GetPath(`/Users/${User_Name}/Desktop/`)
    /**@type {Folder} *///@ts-ignore
    let progfolder = Root.GetPath(`/Programs/`)

    desktopfolder.children.delete(name)
    progfolder.children.delete(name)
}

function Task_Complete(task, failed = false) {
    if (Task.IsCompleted(task) && !failed) return;//すでにタスクをクリアしていて、失敗でなかったなら
    else if (!Task.IsCompleted(task)) {//未クリアなら
        Task.CompletedTask.push(task)
        if (failed) {
            if (Task.IsCompleted(task))
                Task.FailedTask.push(task)
        } else {
            Task.SucceedTask.push(task)
        }
    } else if (failed) {//クリア済みで失敗したのなら
        Task.SucceedTask = Task.SucceedTask.filter((item) => {
            return item !== task;
        });
        Task.FailedTask = Task.FailedTask.filter((item) => {
            return item !== task;
        });
        Task.FailedTask.push(task)
    }
}

function Task_IsCompleted(task) {
    let res = Task.CompletedTask.findIndex(t => t === task)
    return (res === -1) ? false : true
}

function Task_EmitResult(data) {
    Socket.emit("taskresult", JSON.stringify(data))
}


export function Boot(mode) {
    InitParameters(mode)
    initFileSystem(mode)
    RefreshDesktop()
    RefreshTaskbar()
}

export function Reboot() {
    for (let windowid in WindowManager.windows) {//すべてのウィンドウを削除
        WindowManager.windows[windowid].destroy(true);
    }
    const bootwindow = document.getElementById("bootwindow")
    bootwindow.classList.remove("hidden")
    bootwindow.firstElementChild.innerHTML = "シャットダウンしています…"
    setTimeout(() => {
        bootwindow.style.background = "black"
        bootwindow.firstElementChild.innerHTML = ""
        Boot()
        setTimeout(() => {
            bootwindow.style.background = ""
            bootwindow.firstElementChild.innerHTML = "ようこそ"
            setTimeout(() => {
                bootwindow.classList.add("hidden")
            }, 2000);
        }, 1000);
    }, 2000);
}

export function StartGame(msg) {//リザルトとかを初期化
    if (!SystemConfigs.room.status) {//開始されてなければ
        SystemConfigs.connected_wifi = []
        SystemConfigs.installed_software = []
        Result.Revenue = 0
        Result.SecurityScore = 0
        Result.Flag = []
        Task.CompletedTask = []
        Task.FailedTask = []
        Task.SucceedTask = []
        Joblist.splice(0, Joblist.length)

        if (!SystemConfigs.room.status) {
            for (let windowid in WindowManager.windows) {//すべてのウィンドウを削除
                if (windowid != "ゲームマネージャー")
                    WindowManager.windows[windowid].destroy(true);
            }
        }


        for (let serviceid in WindowManager.services) {//すべてのサービスを停止
            WindowManager.services[serviceid].destuctor();
        }
        systemServiceList.forEach(s => {
            new s()
        })
        SystemConfigs.room.startat = msg.startat
        SystemConfigs.room.duration = msg.duration
        SystemConfigs.room.status = true
        GameTimer = setTimeout(StopGame, msg.duration);

        Notify("ゲームが開始されました")
    }
}

export function StopGame(msg) {//サービス等停止用
    if (SystemConfigs.room.status) {//終了してなければ
        for (let serviceid in WindowManager.services) {//すべてのサービスを停止
            WindowManager.services[serviceid].destuctor();
        }
        clearTimeout(GameTimer)
        SystemConfigs.room.status = false
        Notify("ゲームが終了しました")
        new ResultWindow()
    }
}

function initFileSystem(mode) {
    Root.children.clear()
    /**@type {Folder} *///@ts-ignore
    let desktop = Root.NewItem(`/Users/${User_Name}/Desktop/`)
    let document = Root.NewItem(`/Users/${User_Name}/Document/`)
    let picture = Root.NewItem(`/Users/${User_Name}/Picture/`)
    let music = Root.NewItem(`/Users/${User_Name}/Music/`)
    let download = Root.NewItem(`/Users/${User_Name}/Download/`)
    let progfolder = Root.Mkdir("Programs")


    Packages.List.forEach(icon => {
        if(icon.AdminOnly && mode!="create")return
        let tmp = new File(progfolder, icon.Name)
        tmp.icon = icon.Iconurl
        tmp.content = ()=>{new icon.Constructor()}
        new Link(desktop, icon.Name, tmp).icon = icon.Iconurl
    })
    RefreshDesktop()
}

export function InitSystem(){
    const bootwindow = document.getElementById("bootwindow")

    let host = window.document.location.host;   // .replace(/:.*/, '');
    let protocol = window.document.location.protocol == "https:" ? 'wss://' : 'ws://'
    let ServerAddress = protocol + host;         //  + ':8080';
    InitSocket(ServerAddress)
    Logon((mode)=>{
        setTimeout(() => {
            bootwindow.classList.add("hidden")

            Boot(mode)
            
            if (mode == "create") {
                new GameManager()
            }

            if (!SystemConfigs.isWizardClosed) {
                new InitWizard();
            }
        }, 1000);            
    })
    Handlers["gameInfo"] = (msg) => {
        switch (msg.status) {
            case "start": StartGame(msg); break;
            case "stop": StopGame(msg); break;
        }
    };
}
