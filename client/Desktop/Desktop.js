import { GameManager } from './Windows/GameManager.js'
import { LoginWindow }from './Windows/LoginWindow.js'

//ココにウィンドウのリストを追加していく
const windowlist = {
    "GameManager":GameManager,
    "LoginWindow":LoginWindow
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
    }
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