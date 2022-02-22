import 'https://cdn.socket.io/4.1.3/socket.io.js'
import { Notify } from '../Functions/notify.js'
/** @type {import("socket.io").Socket} */
export let Socket

/** @type {Object} */
export let Handlers = {
    "sentToMe": (arg) =>{sentToMe(arg)}
}

export function InitSocket(server) {
    //@ts-ignore
    Socket = io(server);

    Socket.on("connect",() => {
        console.log('Socket接続に成功しました');
        Notify(`サーバーに接続しました`);
    });
    
    Socket.on("disconnect",() => {
        console.log(`Socketが閉じられました`);
        Notify(`サーバーから切断しました`);
    });

    Socket.on("error", (err) => {
        console.log(`Socketエラーが発生しました：${err}`);
        Notify(`Socketエラーが発生しました：${err}`)
    });

    Socket.onAny((event, ...args) => {
        if(typeof Handlers[event] == 'function'){
            Handlers[event](...args)
        }else{
            console.log(`Recieved event ${event} but handler was not found`)
            console.log(...args)
        }
    });

    let uuid = getuuid()
    Socket.emit('regist-uuid', { uuid: uuid })
    
    Handlers["updateUUID"] = (uuid) => {
        // Socket.id = uuid['id'];
        console.log('socketuuid: ' + Socket.id);
    };
}

function generateUuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}

function getuuid() {
    let cookie = getCookieArray()
    let uuid = typeof cookie["uuid"] == 'string' ? cookie["uuid"] : generateUuid();
    if (typeof cookie["uuid"] == 'string') {
        console.log("cookie uuid found!")
    } else {
        console.log("generated new uuid!")
    }
    document.cookie = "uuid=" + uuid
}

function getCookieArray() {
    var arr = new Array();
    if (document.cookie != '') {
        var tmp = document.cookie.split('; ');
        for (var i = 0; i < tmp.length; i++) {
            var data = tmp[i].split('=');
            arr[data[0]] = decodeURIComponent(data[1]);
        }
    }
    return arr;
}

/** 
 * @param {String} socketid 
 * @param {String} eventname 
 * @param {Object} arg
 */
export function SendTo(socketid,eventname,arg){
    Socket.emit("sendTo",{"SocketID":socketid,"arg":{"event":eventname,"arg":arg}})
}

export let SentToMeHandler = {
}

/**
 * @typedef {Object} sentArg
 * @property {String} event
 * @property {Object} arg
 */

/** @param {sentArg} message */
function sentToMe(message){
    if(typeof SentToMeHandler[message.event] == 'function'){
        SentToMeHandler[message.event](message.arg)
    }else{
        console.log(`Recieved event ${message.event} but handler was not found`)
        console.log(message.arg)
    }
}