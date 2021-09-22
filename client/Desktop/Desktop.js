import { GameManager } from './Windows/GameManager.js'
import { LoginWindow } from './Windows/LoginWindow.js'
import { WiFi } from './Windows/WiFI.js'
import { Socket } from '../Functions/socket.js'
import { Crusher } from './Windows/Crusher.js'
import { Mail } from './Windows/Mail.js'
import { InternetBrowser } from './Windows/InternetBrowser.js'
import { Store } from './Windows/Store.js'
import { ResultWindow } from './Windows/ResultWindow.js'
import { JobManager } from './Windows/JobManager.js'

//ココにウィンドウのリストを追加していく
const windowlist = {
    "GameManager": GameManager,
    "LoginWindow": LoginWindow,
    "WiFi": WiFi,
    "Crusher": Crusher,
    "Mail": Mail,
    "InternetBrowser": InternetBrowser,
    "Store": Store,
    "ResultWindow": ResultWindow,
    "JobManager": JobManager
}

let parent = {
    /** @type {HTMLElement} */
    windowarea: null,
    windowindex: 0,
    windows: [],
    CreateWindow: CreateWindow,
    DestroyWindow: DestroyWindow
}

parent.windowarea = document.getElementById("desktop_icons")

export function CallWindow(classname, window_id) {
    if (!window_id) {
        window_id = classname
    }
    if (windowlist[classname]) {
        parent.CreateWindow(windowlist[classname], window_id)
    }
}

export let Task = {
    CompletedTask: [],
    SucceedTask: [],
    FailedTask: [],
    Complete: Complete,
    IsCompleted: IsCompleted,
    EmitResult: EmitResult
}

export let Result = {
    Revenue: 0,
    SecurityScore: 0,
    Flag: [],
}

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

    // Deprecated
    // completed_task: Task.CompletedTask,
    // Task_Complete: Task.Complete,
    // Task_IsCompleted: Task.IsCompleted,
    // EmitResult: Task.EmitResult
}

function CreateWindow(func, window_id) {
    if (parent.windows[window_id]) {
        parent.windows[window_id].bringToTop();
    } else {
        parent.windows[window_id] = new func(parent);//funcクラスのウィンドウを作成
        parent.windows[window_id].window_id = window_id;
    }
}

function DestroyWindow(window_id) {
    if (parent.windows[window_id]) {
        parent.windows[window_id].destroy()
    }
}

function Complete(task, failed = false) {
    Task.CompletedTask.push(task)
    if (failed) {
        Task.FailedTask.push(task)
    } else {
        Task.SucceedTask.push(task)
    }
}

function IsCompleted(task) {
    let res = Task.CompletedTask.findIndex(t => t === task)
    return (res === -1) ? false : true
}

function EmitResult(data) {
    Socket.emit("taskresult", JSON.stringify(data))
}

export let DesktopIconList = [
    { Name: "タスク管理", Iconurl: "/images/jobManagericon.png", Clickfunc: () => { CallWindow("JobManager", "Window_JobManager") } },
    { Name: "Internet Browser", Iconurl: "/images/earth.svg", Clickfunc: () => { CallWindow("InternetBrowser", "Window_InternetBrowser") } },
    { Name: "Game Manager", Iconurl: "/images/manager.svg", Clickfunc: () => { CallWindow("GameManager", "Window_GameManager") } },
    { Name: "メール", Iconurl: "/images/mailicon.png", Clickfunc: () => { CallWindow("Mail", "Window_Mail") } },
    { Name: "ストア", Iconurl: "/images/storeicon.png", Clickfunc: () => { CallWindow("Store", "Window_Store") } },
    { Name: "サーバーにログイン", Iconurl: "/images/padlock.png", Clickfunc: () => { CallWindow("LoginWindow", "Window_LoginWindow") } },
    { Name: "リザルト 画面", Iconurl: "/images/result.svg", Clickfunc: () => { CallWindow("ResultWindow", "Window_ResultWindow") } },
]

export let TaskbarIconList = [
    { Iconurl: "/images/wifiicon.png", Clickfunc: () => { CallWindow("WiFi", "Window_WiFi") } },
]

export function RefreshDesktop() {
    const desktop_icons = document.getElementById("desktop_icons")
    desktop_icons.innerHTML = "";
    let elm_drag
    DesktopIconList.forEach((icon) => {
        /** @type {HTMLElement} *///@ts-ignore
        let temp = createElementFromHTML(`<div class="desktop_icon" draggable="true">
                <img src="${icon.Iconurl}" class="desktop_icon_image"></img>
                <span class="desktop_icon_text">${icon.Name}</span>
                </div>`)
        temp.addEventListener('dblclick', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc();
            temp.classList.remove("selected");
        })
        temp.addEventListener('mousedown', (e) => {
            const selectother = (e) => {
                if (e.target.closest('.selected') !== temp) {
                    temp.classList.remove("selected");
                    desktop_icons.removeEventListener('mousedown', selectother)
                }
            }
            if (!temp.classList.contains("selected")) desktop_icons.addEventListener('mousedown', selectother)
            temp.classList.add("selected");
        })
        desktop_icons.insertAdjacentElement('beforeend', temp)


        // 以下、ドラッグによるアイコン移動
        temp.addEventListener("dragstart", (e) => {
            elm_drag = temp;
        });

        temp.addEventListener('dragover', (e) => {
            e.preventDefault();
            let rect = temp.getBoundingClientRect();
            if ((e.clientY - rect.top) < (temp.clientHeight / 2)) {
                //マウスカーソルの位置が要素の半分より上
                temp.style.borderTop = '2px solid white';
                temp.style.borderBottom = '';
            } else {
                //マウスカーソルの位置が要素の半分より下
                temp.style.borderTop = '';
                temp.style.borderBottom = '2px solid white';
            }
        });
        temp.addEventListener('dragleave', (e) => {
            temp.style.borderTop = '';
            temp.style.borderBottom = '';
        });
        temp.addEventListener('drop', (e) => {
            if (!elm_drag) return
            e.preventDefault();
            e.stopPropagation();
            let rect = temp.getBoundingClientRect();
            if ((e.clientY - rect.top) < (temp.clientHeight / 2)) {
                //マウスカーソルの位置が要素の半分より上
                temp.parentElement.insertBefore(elm_drag, temp);
            } else {
                //マウスカーソルの位置が要素の半分より下
                temp.parentElement.insertBefore(elm_drag, temp.nextSibling);
            }
            temp.style.borderTop = '';
            temp.style.borderBottom = '';
            elm_drag = null
        });
    })
    desktop_icons.addEventListener('drop', (e) => {
        if (!elm_drag) return;
        e.preventDefault();
        desktop_icons.insertBefore(elm_drag, desktop_icons.lastChild.nextSibling);
        elm_drag = null
    });
    desktop_icons.addEventListener('dragover', (e) => {
        if (!elm_drag) return
        e.preventDefault();
    });
}


export function RefreshTaskbar() {
    const desktop_taskbar = document.getElementById("desktop_taskbar")
    desktop_taskbar.innerHTML = "";
    TaskbarIconList.forEach((icon) => {
        let temp = createElementFromHTML(`<img src="${icon.Iconurl}" class="desktop_icon_image"></img>`)
        temp.addEventListener('dblclick', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc();
        })
        desktop_taskbar.insertAdjacentElement('beforeend', temp)
    })

}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstElementChild;
}

RefreshDesktop()
RefreshTaskbar()

export function Init(){//リザルトとかを初期化
    SystemConfigs.connected_wifi=[]
    SystemConfigs.installed_software=[]
    Result.Revenue=0
    Result.SecurityScore=0
    Task.CompletedTask=[]
    Task.FailedTask=[]
    Task.SucceedTask=[]
}