import { GameManager } from './Windows/GameManager.js'
import { LoginWindow } from './Windows/LoginWindow.js'
import { WiFi } from './Windows/WiFi.js'
import { Socket } from '../Functions/socket.js'
import { Crusher } from './Windows/Crusher.js'
import { Mail } from './Windows/Mail.js'
import { InternetBrowser } from './Windows/InternetBrowser.js'
import { Store } from './Windows/Store.js'
import { ResultWindow } from './Windows/ResultWindow.js'
import { JobManager } from './Windows/JobManager.js'
import { MailReciever } from '../Services/Service/MailReciever.js'
import { VirusScanner } from './Windows/VirusScanner.js'

//ココにウィンドウのリストを追加していく
const windowList = {
    "GameManager": GameManager,
    "LoginWindow": LoginWindow,
    "WiFi": WiFi,
    "Crusher": Crusher,
    "Mail": Mail,
    "InternetBrowser": InternetBrowser,
    "Store": Store,
    "ResultWindow": ResultWindow,
    "JobManager": JobManager,
    "VirusScanner": VirusScanner
}

//ココに最初から動かすバックグラウンドサービスのリストを追加していく
const systemServiceList = {
    "MailReciever": MailReciever
}

let parent = {
    /** @type {HTMLElement} */
    windowarea: null,
    windowindex: 0,
    /** @type {Array<import('./Window.js').Window>} */
    windows: [],
    services: [],
}

parent.windowarea = document.getElementById("desktop_icons")

/** ウィンドウを呼ぶ
 * @param {String|Object} classfunc
 * @param {String|Number} window_id
 */
export function CallWindow(classfunc, window_id) {
    if (!window_id && typeof classfunc == 'string') {
        window_id = classfunc
    }
    if (typeof classfunc == 'string') {
        if (windowList[classfunc]) {
            CreateWindow(windowList[classfunc], window_id)
        }
    } else if (typeof classfunc == 'function') {
        CreateWindow(classfunc, window_id)
    }
}

/** サービスを呼ぶ(1個だけ)
 * @param {String|Object} classfunc
 * サービスは1つだけなので識別用IDは無い
 */
export function CallService(classfunc) {
    if (typeof classfunc == 'string') {
        if (!parent.services[classfunc] && systemServiceList[classfunc]) {
            parent.services[classfunc] = new systemServiceList[classfunc](parent);//サービスを作成
        }
    } else if (typeof classfunc == 'function') {
        if (!parent.services[classfunc.name] && systemServiceList[classfunc]) {
            parent.services[classfunc.name] = new classfunc(parent)
        }
    }
}

export let Task = {
    CompletedTask: [],
    SucceedTask: [],
    FailedTask: [],
    Complete: Task_Complete,
    IsCompleted: Task_IsCompleted,
    EmitResult: Task_EmitResult
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

function Task_Complete(task, failed = false) {
    Task.CompletedTask.push(task)
    if (failed) {
        Task.FailedTask.push(task)
    } else {
        Task.SucceedTask.push(task)
    }
}

function Task_IsCompleted(task) {
    let res = Task.CompletedTask.findIndex(t => t === task)
    return (res === -1) ? false : true
}

function Task_EmitResult(data) {
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

export let TaskbarIconList_R = [
    { Iconurl: "/images/wifiicon.png", Clickfunc: () => { CallWindow("WiFi", "Window_WiFi") } },
]

export let MenuIconList = [
    { Name: "タスク管理", Iconurl: "/images/jobManagericon.png", Clickfunc: () => { CallWindow("JobManager", "Window_JobManager") } },
    { Name: "Internet Browser", Iconurl: "/images/earth.svg", Clickfunc: () => { CallWindow("InternetBrowser", "Window_InternetBrowser") } },
    { Name: "メール", Iconurl: "/images/mailicon.png", Clickfunc: () => { CallWindow("Mail", "Window_Mail") } },
    { Name: "ストア", Iconurl: "/images/storeicon.png", Clickfunc: () => { CallWindow("Store", "Window_Store") } },
    { Name: "全てのプログラム", Iconurl: "", Clickfunc: () => { CallWindow("", "") } },
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
            if (!elm_drag) return
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
            if (!elm_drag) return
            temp.style.borderTop = '';
            temp.style.borderBottom = '';
        });
        temp.addEventListener('drop', (e) => {
            if (!elm_drag) return
            e.preventDefault();
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
    const desktop_taskbar_R = document.getElementById("desktop_taskbar_r")
    const desktop_taskbar_menu = document.getElementById("desktop_taskbar_menu")
    desktop_taskbar_R.innerHTML = "";
    TaskbarIconList_R.forEach((icon) => {
        let temp = createElementFromHTML(`<img src="${icon.Iconurl}" class="desktop_icon_image"></img>`)
        temp.addEventListener('dblclick', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc();
        })
        desktop_taskbar_R.insertAdjacentElement('beforeend', temp)
    })

    const menu = desktop_taskbar_menu.firstElementChild;
    menu.innerHTML = "";
    let user = createElementFromHTML(`<div style = "display:flex;">
            <img src="/images/usericon.png" style="display:flex;width:60px; height:60px; margin:10px 10px;"></img>
            <div style = "color:white;padding-top:20px;padding-left:30px;font-size:1.5em;">User</div>
            </div>`);
    menu.insertAdjacentElement('beforeend', user)

    MenuIconList.forEach((icon) => {
        let temp = createElementFromHTML(`<div style = "display:flex;background-color:#ffffff;width:98%;padding-left:5px;">
            <img src="${icon.Iconurl}" style="display:flex;width:40px; height:40px; margin:10px 10px;"></img>
            <div style = "color:black;padding-top:15px;">${icon.Name}</div>
        </div>`)

        menu.insertAdjacentElement('beforeend', temp)
        temp.addEventListener('dblclick', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc();
        })
    })
    let logoff_shutdown = createElementFromHTML(`<div style = "display:flex;width:80%;padding-left:5px;margin:5px 100px;">
            <img src="" style="display:flex;width:20px; height:20px; margin:10px 10px;"></img>
            <div style = "color:white;padding-top:8px;">ログオフ</div>
            <img src="" style="display:flex;width:20px; height:20px; margin:10px 10px;"></img>
            <div style = "color:white;padding-top:8px;">シャットダウン</div>
        </div>`)
    menu.insertAdjacentElement('beforeend', logoff_shutdown)


    menu.classList.add("hidden")
    desktop_taskbar_menu.onclick = (e) => {
        const selectother = (e) => {
            if (e.target.closest('#desktop_taskbar_menu') !== desktop_taskbar_menu) {//メニュー以外のクリックなら
                menu.classList.add("hidden")
                document.removeEventListener('mousedown', selectother)
            }
        }
        if (menu.classList.contains("hidden")) {//メニューが表示されていないとき
            menu.classList.remove("hidden")
            document.addEventListener('mousedown', selectother)
        } else {//メニューが表示されているとき
            if (!e.target.closest('#menu')) {//メニューボタンを押していたなら
                menu.classList.add("hidden")
                document.removeEventListener('mousedown', selectother)
            }
        }
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstElementChild;
}

export function Boot() {
    RefreshDesktop()
    RefreshTaskbar()
}

export function Init() {//リザルトとかを初期化
    SystemConfigs.connected_wifi = []
    SystemConfigs.installed_software = []
    Result.Revenue = 0
    Result.SecurityScore = 0
    Task.CompletedTask = []
    Task.FailedTask = []
    Task.SucceedTask = []

    for (let windowid in parent.windows) {//すべてのウィンドウを削除
        parent.windows[windowid].destroy();
    }
    for (let serviceid in parent.services) {//すべてのサービスを停止
        parent.services[serviceid].destuctor();
    }
    for (let serviceid in systemServiceList) {//初期サービスを呼び出す
        CallService(serviceid)
    }
}

export function Stop() {//サービス等停止用
    for (let serviceid in parent.services) {//すべてのサービスを停止
        parent.services[serviceid].destuctor();
    }
}