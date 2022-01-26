import { Folder, File, Link, Root } from './FileSystem.js'
import { GameManager } from '../Windows/Window/GameManager.js'
import { LoginWindow } from '../Windows/Window/LoginWindow.js'
import { WiFi } from '../Windows/Window/WiFi.js'
import { Socket } from './Network.js'
import { Crusher } from '../Windows/Window/Crusher.js'
import { Mail } from '../Windows/Window/Mail.js'
import { InternetBrowser } from '../Windows/Window/InternetBrowser.js'
import { Store } from '../Windows/Window/Store.js'
import { ResultWindow } from '../Windows/Window/ResultWindow.js'
import { JobManager } from '../Windows/Window/JobManager.js'
import { MailReciever } from '../Services/Service/MailReciever.js'
import { JobReciever } from '../Services/Service/JobReciever.js'
import { Explorer } from '../Windows/Window/Explorer.js'
import { TextInputWindow, YesNoButtonWindow } from '../Functions/InputWindow.js'
import { AddContextMenu } from '../Functions/contextmenu.js'
import { Notify } from '../Functions/notify.js'

const UserName = "ANZEN"

//ココにウィンドウのリストを追加していく
// const windowList = {
//     "GameManager": GameManager,
//     "LoginWindow": LoginWindow,
//     "WiFi": WiFi,
//     "Crusher": Crusher,
//     "Mail": Mail,
//     "InternetBrowser": InternetBrowser,
//     "Store": Store,
//     "ResultWindow": ResultWindow,
//     "JobManager": JobManager,
//     "VirusScanner": VirusScanner,
//     "Excol": Excol,
//     "Explorer": Explorer,
//     "Installer": Installer
// }

//ココに最初から動かすバックグラウンドサービスのリストを追加していく
const systemServiceList = [
    MailReciever,
    JobReciever,
]

export let WindowManager = {
    /** @type {HTMLElement} */
    windowarea: null,
    windowindex: 0,
    /** @type {Array<import('../Windows/Window.js').Window>} */
    windows: [],
    services: [],
}

WindowManager.windowarea = document.getElementById("desktop_windows")

/** ウィンドウを呼ぶ
 * @param {String|Object} classfunc
 * @param {String|Number=} window_id
 */
// export function CallWindow(classfunc, window_id) {
//     if (!window_id && typeof classfunc == 'string') {
//         window_id = classfunc
//     }
//     if (typeof classfunc == 'string') {
//         if (windowList[classfunc]) {
//             CreateWindow(windowList[classfunc], window_id)
//         }
//     } else if (typeof classfunc == 'function') {
//         CreateWindow(classfunc, window_id)
//     }
// }

/** サービスを呼ぶ(1個だけ)
 * @param {String|Object} classfunc
 * サービスは1つだけなので識別用IDは無い
 */
// export function CallService(classfunc) {
//     if (typeof classfunc == 'string') {
//         // if (!WindowManager.services[classfunc] && systemServiceList[classfunc]) {
//         //     WindowManager.services[classfunc] = new systemServiceList[classfunc]();//サービスを作成
//         // }
//         new systemServiceList[classfunc]()
//     } else if (typeof classfunc == 'function') {
//         // if (!WindowManager.services[classfunc.name] && systemServiceList[classfunc]) {
//         //     WindowManager.services[classfunc.name] = new classfunc()
//         // }
//         new classfunc()
//     }
// }

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

    Packages: {
        List: [],
        Install: package_Install,
        Uninstall: package_Uninstall
    }
}

function package_Install(name, iconurl, func) {
    SystemConfigs.Packages.List.push(name)
    /**@type {Folder} *///@ts-ignore
    let desktopfolder = Root.GetPath(`/Users/${UserName}/Desktop/`)
    /**@type {Folder} *///@ts-ignore
    let progfolder = Root.GetPath(`/Programs/`)

    let tmp = new File(progfolder, name)
    tmp.icon = iconurl
    tmp.content = func
    new Link(desktopfolder, name, tmp).icon = iconurl

}
function package_Uninstall(name) {
    SystemConfigs.Packages.List.filter((item) => {
        return item !== name
    })
    /**@type {Folder} *///@ts-ignore
    let desktopfolder = Root.GetPath(`/Users/${UserName}/Desktop/`)
    /**@type {Folder} *///@ts-ignore
    let progfolder = Root.GetPath(`/Programs/`)

    desktopfolder.children.delete(name)
    progfolder.children.delete(name)
}

function CreateWindow(func, window_id) {
    if (WindowManager.windows[window_id]) {
        WindowManager.windows[window_id].BringToTop();
    } else {
        // WindowManager.windows[window_id] = new func();//funcクラスのウィンドウを作成
        // WindowManager.windows[window_id].window_id = window_id;
        new func()
        RefreshTaskbarIcons();
    }
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

export let DesktopIconList = [
    { Name: "タスク管理", Iconurl: "/images/jobManagericon.png", Clickfunc: () => { new JobManager() } },
    { Name: "Internet Browser", Iconurl: "/images/earth.svg", Clickfunc: () => { new InternetBrowser() } },
    { Name: "Game Manager", Iconurl: "/images/manager.svg", Clickfunc: () => { new GameManager() } },
    { Name: "メール", Iconurl: "/images/mailicon.png", Clickfunc: () => { new Mail() } },
    { Name: "ストア", Iconurl: "/images/storeicon.png", Clickfunc: () => { new Store() } },
    { Name: "サーバーにログイン", Iconurl: "/images/padlock.png", Clickfunc: () => { new LoginWindow() } },
    { Name: "リザルト 画面", Iconurl: "/images/result.svg", Clickfunc: () => { new ResultWindow() } },
    { Name: "Explorer", Iconurl: "/images/folder.svg", Clickfunc: () => { new Explorer() } },
]

export let TaskbarIconList_R = [
    { Iconurl: "/images/wifiicon.png", Clickfunc: () => { new WiFi() } },
    { Iconurl: "/images/icons/fullscr.svg", Clickfunc: (icon) => {
        console.log(icon)
        if (document.fullscreenElement !== undefined && document.fullscreenElement !== null){
            document.exitFullscreen()
            icon.Iconurl = "/images/icons/fullscr.svg"
        } else {
            if( document.body.requestFullscreen ) {
                document.body.requestFullscreen()
                icon.Iconurl = "/images/icons/nofullscr.svg"
            }else{
                Notify("フルスクリーン表示に失敗しました")
            }
        }
        RefreshTaskbar()
    } },
]

export let MenuIconList_L = [
    { Name: "タスク管理", Iconurl: "/images/jobManagericon.png", Clickfunc: () => { new JobManager() } },
    { Name: "Internet Browser", Iconurl: "/images/earth.svg", Clickfunc: () => { new InternetBrowser() } },
    { Name: "メール", Iconurl: "/images/mailicon.png", Clickfunc: () => { new Mail() } },
    { Name: "ストア", Iconurl: "/images/storeicon.png", Clickfunc: () => { new Store() } },
    { Name: "Game Manager", Iconurl: "/images/manager.svg", Clickfunc: () => { new GameManager() } },
]
export let MenuIconList_R = [
    { Name: "マイドキュメント", Iconurl: "/images/directory.png", Clickfunc: () => { new Explorer("/Users/ANZEN/Document/") } },
    { Name: "マイピクチャ", Iconurl: "/images/directory.png", Clickfunc: () => { new Explorer("/Users/ANZEN/Picture/") } },
    { Name: "マイミュージック", Iconurl: "/images/directory.png", Clickfunc: () => { new Explorer("/Users/ANZEN/Music/") } },
    { Name: "ダウンロード", Iconurl: "/images/directory.png", Clickfunc: () => { new Explorer("/Users/ANZEN/Download/") } },
    { Name: "Wi-Fi", Iconurl: "/images/wifiicon.png", Clickfunc: () => { new WiFi() } },
]
export function RefreshDesktop() {
    const desktop_icons = document.getElementById("desktop_icons")
    /** @type {Folder} *///@ts-ignore
    let desktopfolder = Root.GetPath(`/Users/${UserName}/Desktop/`)
    desktop_icons.innerHTML = "";
    let elm_drag
    desktopfolder.children.forEach(item => {
        /** @type {HTMLElement} *///@ts-ignore
        let temp = createElementFromHTML(`<div class="icon${item.target?" shortcut":""}" draggable="true">
                <div class="icon_image"><img src="${item.icon}"></img></div>
                <span class="icon_text">${item.name}</span>
                </div>`)
        temp.addEventListener('dblclick', () => {
            //@ts-ignore
            if (item.isdir) new Explorer(item)
            else item.Open()
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
        let menu = createElementFromHTML(`
            <ul>
                <li>Delete</li>
                <li>Rename</li>
                ${item.target?"<li>Open Target Folder</li>":""}
            </ul>
            `)
        menu.firstElementChild.addEventListener("click", () => {
            new YesNoButtonWindow("削除", "ファイルを削除しますか?", (del) => {
                if (!del) return
                item.Delete()
                RefreshDesktop()
            })
        })
        menu.firstElementChild.nextElementSibling.addEventListener("click", () => {
            let itemname
            if (item.isdir) itemname = "フォルダ名"
            else itemname = "ファイル名"
            new TextInputWindow(itemname, `${itemname}を入力してください`, (text) => {
                if (!text) return
                item.Rename(text)
                RefreshDesktop()
            })
        })
        if(item.target != null){
            menu.firstElementChild.nextElementSibling.nextElementSibling.addEventListener("click",()=>{
                new Explorer(item.target.parent)
            })
        }
        AddContextMenu(temp, menu)
    })
    desktop_icons.ondrop = (e) => {
        if (!elm_drag) return;
        e.preventDefault();
        desktop_icons.insertBefore(elm_drag, desktop_icons.lastChild.nextSibling);
        elm_drag = null
    }
    desktop_icons.ondragover = (e) => {
        if (!elm_drag) return
        e.preventDefault();
    }
    let menu = createElementFromHTML(`
        <ul>
            <li>Create New Folder</li>
            <li>Create New File</li>
            <hr>
            <li>Refresh</li>
        </ul>
        `)
    menu.firstElementChild.addEventListener("click", () => {
        new TextInputWindow("フォルダ名", "フォルダ名を入力してください", (text) => {
            if (!text) return
            desktopfolder.Mkdir(text)
            RefreshDesktop()
        })
    })
    menu.firstElementChild.nextElementSibling.addEventListener("click", () => {
        new TextInputWindow("ファイル名", "ファイル名を入力してください", (text) => {
            if (!text) return
            desktopfolder.Touch(text)
            RefreshDesktop()
        })
    })
    menu.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener("click", () => {
        RefreshDesktop()
    })
    AddContextMenu(desktop_icons, menu)
}


export function RefreshTaskbar() {
    const desktop_taskbar_R = document.getElementById("desktop_taskbar_r")
    const desktop_taskbar_menu = document.getElementById("desktop_taskbar_menu")
    desktop_taskbar_R.innerHTML = "";
    TaskbarIconList_R.forEach((icon) => {
        let temp = createElementFromHTML(`<img src="${icon.Iconurl}" class="desktop_icon_image"></img>`)
        temp.addEventListener('click', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc(icon);
        })
        desktop_taskbar_R.insertAdjacentElement('beforeend', temp)
    })

    const menu = desktop_taskbar_menu.firstElementChild;
    menu.innerHTML = "";
    let user = createElementFromHTML(`<div style = "display:flex;padding-bottom:0.5em;">
            <img src="/images/usericon.png" style="display:flex;width:4em; height:4em; margin-left:2em;margin-top:0.5em;"></img>
            <div style = "color:white;padding-top:1.5em;padding-left:3em;font-size:2em;">${UserName}</div>
            </div>`);
    menu.insertAdjacentElement('beforeend', user)

    MenuIconList_L.forEach((icon, i) => {
        let temp = createElementFromHTML(`<div style = "display:flex;background-color:#c0c0c0;width:98%;padding-left:0.5em;">
            <img src="${icon.Iconurl}" style="display:flex;width:2em; height:1.7em; margin:0.8em 0.6em;"></img>
            <div style = "color:black;padding-top:1em;font-size:1em;width:12em;">${icon.Name}</div>

            <img src="${MenuIconList_R[i].Iconurl}" style="display:flex;width:2em;height:1.7em;background-color:rgb(157, 185, 220);padding-left:1em;padding-top:1em;padding-bottom:1em;"></img>
            <div style = "display:flex;background-color:rgb(157, 185, 220);width:46%;color:black;padding-top:1em;padding-left:1em;font-size:1em;>
                <div style = "">${MenuIconList_R[i].Name}</div>
            </div>
        </div>`)

        menu.insertAdjacentElement('beforeend', temp)
        temp.firstElementChild.addEventListener('click', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc();
        })
        temp.firstElementChild.nextElementSibling.addEventListener('click', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc();
        })

        temp.firstElementChild.nextElementSibling.nextElementSibling.addEventListener('click', () => {
            if (typeof MenuIconList_R[i].Clickfunc == "function") MenuIconList_R[i].Clickfunc();
        })
        temp.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener('click', () => {
            if (typeof MenuIconList_R[i].Clickfunc == "function") MenuIconList_R[i].Clickfunc();
        })
    })
    let temp = createElementFromHTML(`<div style = "display:flex;background-color:#c0c0c0;width:48%;padding-left:0.5em;">
            <div style = "color:black;padding-left:1.7em;padding-top:0.3em;font-size:1em;width:12em;">全てのプログラム</div>
            <img src="/images/arrow.png" style="display:flex;width:3.3em; height:2em;margin-left:0px;margin-top:0em;"></img>
        </div>`);
    menu.insertAdjacentElement('beforeend', temp);

    let logoff_shutdown = createElementFromHTML(`<div style = "display:flex;width:80%;padding-left:1em;margin:0.1em 4em;">
            <img src="/images/logoff.png" style="display:flex;width:2em; height:2em; margin:0.5em 1em;"></img>
            <div style = "color:white;padding-top:1em;font-size:1em;">ログオフ</div>
            <img src="/images/shutdown.png" style="display:flex;width:2em; height:2em; margin:0.5em 1em;"></img>
            <div style = "color:white;padding-top:1em;font-size:1em;">シャットダウン</div>
        </div>`)
    menu.insertAdjacentElement('beforeend', logoff_shutdown);

    logoff_shutdown.firstElementChild.addEventListener('click', () => {
        new LoginWindow()
    })
    logoff_shutdown.firstElementChild.nextElementSibling.nextElementSibling.addEventListener('click', () => {
        Reboot()
    })

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
            //@ts-ignore
            if (e.target != menu) {//メニューボタンを押していたなら
                menu.classList.add("hidden")
                document.removeEventListener('mousedown', selectother)
            }
        }
    }
}

export function RefreshTaskbarIcons() {
    const icons = document.getElementById("desktop_taskbar_l");
    icons.innerHTML = "";
    for (let windowid in WindowManager.windows) {
        let temp = createElementFromHTML(`<div style="height:100%;width:6em;overflow: hidden;display: flex;flex-direction: row;align-items: center;user-select:none;border-top:white solid 2px;margin-right: 2px;box-sizing:border-box;">
        <span style="color:white;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;flex-shrink: 1;">${WindowManager.windows[windowid].title}</span>
        </div>`)
        temp.addEventListener("click", () => {
            if (WindowManager.windows[windowid].window.classList.contains("disabled") || !WindowManager.windows[windowid].window.classList.contains("active")) {
                WindowManager.windows[windowid].BringToTop()
            } else {
                WindowManager.windows[windowid].Minimize()
            }
        })
        icons.insertAdjacentElement("beforeend", temp)
    }
}

/** @returns {HTMLElement} */
function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    //@ts-ignore
    return template.content.firstElementChild;
}

export function Boot() {
    initFileSystem()
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
        initFileSystem()
        setTimeout(() => {
            bootwindow.style.background = ""
            bootwindow.firstElementChild.innerHTML = "ようこそ"
            setTimeout(() => {
                bootwindow.classList.add("hidden")
            }, 2000);
        }, 1000);
    }, 2000);
}

export function InitGame() {//リザルトとかを初期化
    SystemConfigs.connected_wifi = []
    SystemConfigs.installed_software = []
    Result.Revenue = 0
    Result.SecurityScore = 0
    Task.CompletedTask = []
    Task.FailedTask = []
    Task.SucceedTask = []

    // for (let windowid in WindowManager.windows) {//すべてのウィンドウを削除
    //     WindowManager.windows[windowid].destroy(true);
    // }
    for (let serviceid in WindowManager.services) {//すべてのサービスを停止
        WindowManager.services[serviceid].destuctor();
    }
    systemServiceList.forEach(s=>{
        new s()
    })
}

export function StopGame() {//サービス等停止用
    for (let serviceid in WindowManager.services) {//すべてのサービスを停止
        WindowManager.services[serviceid].destuctor();
    }
}

function initFileSystem() {
    Root.children.clear()
    /**@type {Folder} *///@ts-ignore
    let desktop = Root.NewItem(`/Users/${UserName}/Desktop/`)
    let document = Root.NewItem(`/Users/${UserName}/Document/`)
    let picture = Root.NewItem(`/Users/${UserName}/Picture/`)
    let music = Root.NewItem(`/Users/${UserName}/Music/`)
    let download = Root.NewItem(`/Users/${UserName}/Download/`)
    let progfolder = Root.Mkdir("Programs")


    DesktopIconList.forEach(icon => {
        let tmp = new File(progfolder, icon.Name)
        tmp.icon = icon.Iconurl
        tmp.content = icon.Clickfunc
        new Link(desktop, icon.Name, tmp).icon = icon.Iconurl
    })
    RefreshDesktop()
}

function lsall(dir) {
    /** @type {Folder} *///@ts-ignore
    if (typeof dir == "string") dir = Root.GetPath(dir).children
    else if (!dir) dir = Root.children
    dir.forEach(element => {
        console.log(element.Pwd())
        if (element.isdir) {
            lsall(element.children)
        }
    });
}
window["lsall"] = lsall
window["getpath"] = (path) => { return Root.GetPath(path) }