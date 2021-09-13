import { GameManager } from './Windows/GameManager.js'
import { LoginWindow }from './Windows/LoginWindow.js'
import { WiFi }from './Windows/WiFI.js'

//ココにウィンドウのリストを追加していく
const windowlist = {
    "GameManager":GameManager,
    "LoginWindow":LoginWindow,
    "WiFi":WiFi
}

let parent = {
    /** @type {HTMLElement} */
    windowarea:null,
    windowindex:0,
    windows:[],
    CreateWindow:CreateWindow,
    DestroyWindow:DestroyWindow
}

parent.windowarea = document.getElementById("htmlwindows")

export function CallWindow(classname,window_id){
    if(!window_id){
        window_id = classname
    }
    if(windowlist[classname]){
        parent.CreateWindow(windowlist[classname],window_id)
    }
}

export let configs = {
    "installed_software": [],      // アプリストアから入れたソフト
    room:{
        roomid:""
    },
    connected_wifi: [],
    completed_task: [],
    Task_Complete:Task_Complete,
    Task_IsCompleted:Task_IsCompleted,
    EmitResult:EmitResult
}

function CreateWindow(func,window_id){
    if (parent.windows[window_id]){
        parent.windows[window_id].bringToTop();
    }else{
        parent.windows[window_id] = new func(parent);//funcクラスのウィンドウを作成
        parent.windows[window_id].window_id = window_id;
    }
}

function DestroyWindow(window_id){
    if (parent.windows[window_id]){
        parent.windows[window_id].destroy()
    }
}

function Task_Complete(task) {
    configs.completed_task.push(task)
}

function Task_IsCompleted(task) {
    let res = configs.completed_task.findIndex(t => t === task)
    return (res === -1) ? false : true
}

function EmitResult(data) {
    window["socket"].emit("taskresult", JSON.stringify(data))
}