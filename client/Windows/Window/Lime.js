'use strict'
import { Window, createElementFromHTML } from "../Window.js"
import { WindowManager } from "../../System/Desktop.js";
import { SendTo, SentToMeHandler, Socket } from "../../System/Network.js"
import { Notify } from "../../Functions/notify.js";

const html = `
<div app-lime>
    <div class="users"> 
    </div>
    <div class="talk">
        <div class="name"></div>
        <div class="chats group">
        </div>
        <div class="input hidden">
            <textarea placeholder="メッセージを入力"></textarea>
            <button>送信</button>
        </div>
    </div>
</div>
<link rel="stylesheet" href="/css/Windows/Lime.css">
`

let chats = [
  {
    "user":{
      "name": "username",
      "socketID": "socketid"
    },
    "messages":[
      {
        "user":{
          "name": "username",
          "socketID": "socketid"
        },
        "message":"message",
        "timestamp":0
      }
    ]
  }
]
chats = []

const style = "width: 40em;height: 30em;"
export class Lime extends Window {
  constructor() {
    super(html, "Lime", { style: style })
    if (this.creationFailed) return

    /** @type {HTMLElement} *///@ts-ignore
    this.users = this.bodyElem.firstElementChild.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.talk = this.users.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.chatname = this.talk.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.chatarea = this.chatname.nextElementSibling

    /** @type {HTMLElement} *///@ts-ignore
    this.inputarea = this.chatarea.nextElementSibling
    /** @type {HTMLInputElement} *///@ts-ignore
    this.inputmessage = this.inputarea.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.submitbutton = this.inputmessage.nextElementSibling

    this.selecteduser = {}

    Socket.emit("getGameInfo", (res) => {
      if (res.users) {
        this.myID = res.myID
        res.users.forEach((user) => {
          if (user.SocketID != res.myID){
            let i = chats.findIndex(c=>c.user.socketID == user.SocketID)
            if( i == -1) chats.push({
                "user":{
                  "name": user.Name ? user.Name : user.SocketID,
                  "socketID": user.SocketID
                },
                "messages":[]
              })
          }else{
            this.myname = user.Name
          }
        })
      }
      this.refreshUsers()
    })

    this.submitbutton.addEventListener("click",()=>this.send())
  }
  send() {
    let message={
      "user":{
        "name": this.myname,
        "socketID": this.myID
      },
      "message":this.inputmessage.value,
      "timestamp":Date.now()
    }
    SendTo(this.selecteduser.socketID,"LimeMessage",message)
    this.inputmessage.value = ""
    let i = chats.findIndex(c=>c.user.socketID == this.selecteduser.socketID)
    chats[i].messages.push(message)
    this.selectChat(chats[i])
  }
  selectChat(chat) {
    this.inputarea.classList.remove("hidden")
    this.chatarea.innerHTML=""
    this.selecteduser = chat.user
    chat.messages.forEach(message=>{
      let elem = this.parseMessage(message)
      this.chatarea.insertAdjacentElement("beforeend",elem)
    })
    this.chatname.textContent = chat.user.name
  }
  refreshUsers() {
    this.users.innerHTML=""
    chats.forEach(chat=>{
      let elem = createElementFromHTML(`<div class="user">
          <div class="usericon"><img src="/images/manager.svg"></div>
          <div class="texts">
            <span class="name">${chat.user.name}</span>
            <span class="message">${chat.messages[chat.messages.length]?chat.messages[chat.messages.length]:""}</span>
          </div>
        </div>`)
      elem.addEventListener("click",()=>this.selectChat(chat))
      this.users.insertAdjacentElement("beforeend",elem)
      if(this.selecteduser == chat.user){
        this.selectChat(chat)
      }
    })
  }
  parseMessage(message){
    let date = new Date(message.timestamp)
    let now = new Date()
    let time = ""
    if(date.getFullYear() != now.getFullYear())time = date.getFullYear()+"年 "+date.getMonth()+"月"+date.getDate()+"日 "+date.getHours()+":"+date.getMinutes()
    else if(date.getMonth() != now.getMonth())time = date.getMonth()+"月"+date.getDate()+"日 "+date.getHours()+":"+date.getMinutes()
    else if(date.getDate() != now.getDate())time = date.getMonth()+"月"+date.getDate()+"日 "+date.getHours()+":"+date.getMinutes()
    else time = date.getHours()+":"+date.getMinutes()

    return createElementFromHTML(`<div class="chat${message.user.socketID == this.myID?" me":""}">
          <div class="usericon"><img src="/images/manager.svg"></div>
          <div class="texts">
              <span class="name">${message.user.name}</span>
              <div>
                <span class="message">${message.message}</span>
                <span class="timestamp">${time}</span>
              </div>
          </div>            
      </div>`)
  }
}

(()=>{
  SentToMeHandler["LimeMessage"] = (message) => {
    console.log(message)
    let c = chats.find(chat=> chat.user.socketID == message.user.socketID)
    if(c == undefined) c = {
        "user":{
          "name": message.user.name ?? message.user.socketID,
          "socketID": message.user.socketID
        },
        "messages":[]
      }
    c.messages.push(message)
    chats = chats.filter(chat=>chat.user!==c.user)
    chats.unshift(c)
    let win = WindowManager.windows["Lime"]
    if(win != undefined && "refreshUsers" in win && typeof win.refreshUsers == "function"){
      WindowManager.windows["Lime"].refreshUsers()
    }else{
      Notify(`Limeのメッセージ: ${c.user.name}<br>${message.message}`,{callback:()=>{
        let tmp = new Lime()
        tmp.selectChat(c)
      }})
    }
  }
})()