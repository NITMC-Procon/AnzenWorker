import { GameManager } from './Windows/GameManager.js'
import { LoginWindow } from './Windows/LoginWindow.js'
import { WiFi } from './Windows/WiFI.js'
import { Socket } from '../Functions/socket.js'
import { Crusher } from './Windows/Crusher.js'
import { Mail } from './Windows/Mail.js'
import { InternetBrowser } from './Windows/InternetBrowser.js'
import { Store } from './Windows/Store.js'

//ココにウィンドウのリストを追加していく
const windowlist = {
    "GameManager": GameManager,
    "LoginWindow": LoginWindow,
    "WiFi": WiFi,
    "Crusher": Crusher,
    "Mail": Mail,
    "InternetBrowser": InternetBrowser,
    "Store": Store
}

let parent = {
    /** @type {HTMLElement} */
    windowarea: null,
    windowindex: 0,
    windows: [],
    CreateWindow: CreateWindow,
    DestroyWindow: DestroyWindow
}

parent.windowarea = document.getElementById("htmlwindows")

export function CallWindow(classname, window_id) {
    if (!window_id) {
        window_id = classname
    }
    if (windowlist[classname]) {
        parent.CreateWindow(windowlist[classname], window_id)
    }
}

export let SystemConfigs = {
    "installed_software": [],      // アプリストアから入れたソフト
    room: {
        roomid: "",
        username: "名無しの社員さん",
    },
    connected_wifi: [],
    completed_task: [],
    Task_Complete: Task_Complete,
    Task_IsCompleted: Task_IsCompleted,
    EmitResult: EmitResult
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

function Task_Complete(task) {
    SystemConfigs.completed_task.push(task)
}

function Task_IsCompleted(task) {
    let res = SystemConfigs.completed_task.findIndex(t => t === task)
    return (res === -1) ? false : true
}

function EmitResult(data) {
    Socket.emit("taskresult", JSON.stringify(data))
}

export let DesktopIconList = [
    { Name: "タスク管理", Iconurl: "/images/jobManagericon.png", Clickfunc: () => { CallWindow("JobManager", "Window_JobManager") } },
    { Name: "Internet Browser", Iconurl: "/images/wifiicon.png", Clickfunc: () => { CallWindow("InternetBrowser", "Window_InternetBrowser") } },
    { Name: "Game Manager", Iconurl: "/images/wifiicon.png", Clickfunc: () => { CallWindow("GameManager", "Window_GameManager") } },
    { Name: "メール", Iconurl: "/images/mailicon.png", Clickfunc: () => { CallWindow("Mail", "Window_Mail") } },
    { Name: "サーバーにログイン", Iconurl: "/images/padlock.png", Clickfunc: () => { CallWindow("LoginWindow", "Window_LoginWindow") } },
]

export let TaskbarIconList = [
    { Iconurl: "/images/wifiicon.png", Clickfunc: () => { CallWindow("WiFi", "Window_WiFi") } },
]

export function RefreshDesktop() {
    const desktop_icons = document.getElementById("desktop_icons")
    desktop_icons.innerHTML = "";
    DesktopIconList.forEach((icon) => {
        let temp = createElementFromHTML(`<div class="desktop_icon">
                <img src="${icon.Iconurl}" class="desktop_icon_image"></img>
                <span class="desktop_icon_text">${icon.Name}</span>
            </div>`)
        temp.addEventListener('dblclick', () => {
            if (typeof icon.Clickfunc == "function") icon.Clickfunc();
        })
        temp.addEventListener('click', () => {
            const selectother = (e) => {
                if (e.target.closest('.selected') !== temp) {
                    temp.classList.remove("selected");
                    desktop_icons.removeEventListener('mousedown', selectother)
                }
            }
            temp.classList.add("selected");
            desktop_icons.addEventListener('mousedown', selectother)
        })
        desktop_icons.insertAdjacentElement('beforeend', temp)
    })
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