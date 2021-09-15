'use strict'
import { Window } from "../Window.js"
import { SystemConfigs,CallWindow } from "../Desktop.js"
import { SendTo,SentToMeHandler,Socket } from "../../Functions/socket.js"

const html = `
<div style="display: flex;width: 100%;height: 100%;user-select:none;">
  <div style="width: 15em;overflow:auto;">
    <div style="display: flex;justify-content: center;align-items: center;flex-direction: row;">
        <h2 style="padding: 0.2em;margin:0;text-align: center;">受信ボックス</h2>
        <div class="file" style="display:inline-block">New</div>
    </div>
    <div>
    </div>
  </div>
  <div class="mail">
    <h1 style="margin:0;">メール</h1>
    <div>
        <span>from: </span><span></span>
        <hr>
    </div>
    <div class="file" style="display:none;"></div>
    <p style="margin:2px 0 0 0"></p>
    <div class="file" style="display:none;">削除</div>
  </div>
  <div class="mail disabled" style="display:flex;flex-direction:column;">
    <h1 style="margin:0;">新規メール</h1>
    <div>
        <span>To:</span><select></select>
    </div>
    <div>
        タイトル:<input type="text"></input>
    </div>
    <textarea style="flex:1;resize: none;width:100%;box-sizing:border-box"></textarea>
    <div>
        <div class="file">キャンセル</div>
        <div class="file">送信</div>
    </div>
  </div>
</div>
<style>
  .mailbox {
    margin: 0.2em;
    padding: 0.2em;
    background-color: rgb(235, 235, 235);
    overflow: hidden;
  }

  .mailbox>* {
    margin: 0;
    white-space: nowrap;
  }

  .mail {
    border-left: black solid 2px;
    padding-left: 0.2em;
    padding-right: 0.2em;
    width: calc(100% - 15em);
    overflow:auto;
  }

  .file {
    display: inline-block;
    padding: 0.5em 1em;
    background-color: rgb(104, 104, 104);
    color: white;
    margin: 2px;
  }
</style>`
const style="width:40em;height:20em;"

export let maillist = [
    {
        sub:"テストメール",
        from:"tsest@as",
        text:`先生へ

        4Fの太郎です。
        
        例の物を添付ファイルとしてお送り致します。
        ご確認の方よろしくお願いします。
        
        舞鶴工業高等専門学校 機械制御情弱科 4年 舞鶴 太郎
        Email: taro@maizuru.kosen.ac.jp`,
        file:{
            name:"file.exe",
            func:()=>{ CallWindow("Crusher",Math.random())}
        }
    },
    {
        sub:"メール",
        from:"test@f",
        text:`てすと`
    }
]


export class Mail extends Window{
    constructor(parent){
        super(html,"WiFi",parent,{style:style});
        
        /** @type {HTMLElement} *///@ts-ignore
        this.maillist = this.bodyElem.firstElementChild.firstElementChild.lastElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.mailtitlearea = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.mailfromarea = this.mailtitlearea.nextElementSibling.firstElementChild.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.mailfilearea = this.mailtitlearea.nextElementSibling.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.mailtextarea = this.mailfilearea.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.maildelbutton = this.mailtextarea.nextElementSibling

        /** @type {HTMLElement} *///@ts-ignore
        this.mailarea =  this.bodyElem.firstElementChild.firstElementChild.nextElementSibling

        /** @type {HTMLInputElement} *///@ts-ignore
        this.mailrefresh =  this.bodyElem.firstElementChild.firstElementChild.firstElementChild.firstElementChild

        /** @type {HTMLElement} *///@ts-ignore
        this.newmailarea =  this.mailarea.nextElementSibling
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailbutton =  this.bodyElem.firstElementChild.firstElementChild.firstElementChild.lastElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailto =  this.newmailarea.firstElementChild.nextElementSibling.lastElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailsub =  this.newmailarea.firstElementChild.nextElementSibling.nextElementSibling.lastElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailtext =  this.newmailarea.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmaildelbutton =  this.newmailtext.nextElementSibling.firstElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.newmailsendbutton =  this.newmaildelbutton.nextElementSibling

        Socket.emit("getGameInfo",(res)=>{
            this.newmailfrom = res.myID
            this.newmailto.innerHTML = ""
            let temp = ""
            console.log(res)
            res.users.forEach((user)=>{
                if(user.SocketID != this.newmailfrom) temp += `<option value="${user.SocketID}">${user.Name?user.Name:user.SocketID}</option>`
            })
            this.newmailto.innerHTML = temp
        })

        this.refreshMails()
        
        this.mailfilearea.addEventListener('click',()=>{
            this.openfile()
        })
        this.maildelbutton.addEventListener('click',()=>{
            this.deleteMail()
        })
        this.newmailbutton.addEventListener('click',()=>{
            this.mailarea.classList.add("disabled")
            this.newmailarea.classList.remove("disabled")
        })
        this.newmaildelbutton.addEventListener('click',()=>{
            this.mailarea.classList.remove("disabled")
            this.newmailarea.classList.add("disabled")
        })
        this.newmailsendbutton.addEventListener('click',()=>{
            this.send()
            this.mailarea.classList.remove("disabled")
            this.newmailarea.classList.add("disabled")
        })
        this.mailrefresh.addEventListener('click',()=>{
            this.refreshMails()
        })
    }
    send(){
        let sub = this.newmailsub.value
        let to = this.newmailto.value
        let text = this.newmailtext.value
        SendTo(to,{event:"newMail",arg:{
            sub:sub,
            from:this.newmailfrom,
            text:text
        }})
        this.newmailsub.value = ""
        this.newmailto.value = ""
        this.newmailtext.value = ""
    }
    select(mail){
        this.keep = mail
        this.mailtitlearea.textContent = mail.sub?mail.sub:""
        //@ts-ignore
        this.mailtextarea.innerText = mail.text?mail.text:""
        this.mailfromarea.innerText = mail.from?mail.from:""
        if(mail.file){
            this.mailfilearea.style.display=""
            this.mailfilearea.textContent = mail.file.name;
        }else{
            this.mailfilearea.style.display="none"
        }
        this.maildelbutton.style.display=(mail?"":"none")
    }
    openfile(){
        if(this.keep && this.keep.file.func){
            this.keep.file.func()
        }
    }
    deleteMail(){
        maillist = maillist.filter((item)=> {
            return item !== this.keep;
        });
        this.select([])
        this.refreshMails()
    }
    refreshMails(){
        this.maillist.innerHTML=""
        maillist.forEach((mail) =>{
            let temp = createElementFromHTML(`<div class="mailbox">
                    <h2>${mail.sub}</h2>
                    <p>${mail.text}</p>
                </div>`)
            temp.addEventListener('click',()=>{
                this.select(mail)
            })
            this.maillist.insertAdjacentElement('beforeend',temp)
        })
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}

SentToMeHandler["newMail"] = (mail)=>{
    maillist.push(mail)
}