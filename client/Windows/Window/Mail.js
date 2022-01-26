'use strict'
import { Window, RandomData, createElementFromHTML } from "../Window.js"
import { SystemConfigs, Task } from "../../System/Desktop.js"
import { SendTo,SentToMeHandler,Socket } from "../../Functions/socket.js"
import { Notify } from "../../Functions/notify.js"
import { AddContextMenu } from '../../Functions/contextmenu.js'

const RandData = RandomData()

const html = `
<div style="display: flex;width: 100%;height: 100%;user-select:none;" ${RandData}>
  <div style="width: 15em;overflow:auto;border-right: black solid 2px;">
    <div style="display: flex;justify-content: center;align-items: center;flex-direction: row;">
        <h3 style="padding: 0.2em;margin:0;text-align: center;">受信ボックス</h3>
        <div class="file" style="display:inline-block">New</div>
    </div>
    <div>
    </div>
  </div>
  <div class="mail disabled">
    <h3 style="margin:0;"></h3>
    <div>
        <span>from: </span><span></span>
        <hr>
    </div>
    <div class="file file2" style="display:none;"></div>
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
  div[${RandData}] .mailbox {
    margin: 0.2em;
    padding: 0.2em;
    background-color: rgb(235, 235, 235);
    overflow: hidden;
  }

  div[${RandData}] .mailbox>* {
    margin: 0;
    white-space: nowrap;
  }

  div[${RandData}] .mail {
    padding-left: 0.2em;
    padding-right: 0.2em;
    width: calc(100% - 15em);
    overflow:auto;
  }

  div[${RandData}] .file {
    display: inline-block;
    padding: 0.5em 1em;
    background-color: lightblue;
    color: black;
    margin: 2px;
  }

  div[${RandData}] .file2::before {
    content:  "📎 ";
  }
</style>`
const style="width:40em;height:20em;"

export let maillist = []

export class Mail extends Window{
    constructor(){
        super(html,"メール",{style:style,window_id:"Window_Mail"});
        if(this.creationFailed)return
        
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
            if(res.users){
                res.users.forEach((user)=>{
                    if(user.SocketID != this.newmailfrom) temp += `<option value="${user.SocketID}">${user.Name?user.Name:user.SocketID}</option>`
                })
                this.newmailto.innerHTML = temp
            }
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
        })
        this.mailrefresh.addEventListener('click',()=>{
            this.refreshMails()
        })
    }
    send(){
        this.newmailarea.classList.add("disabled")
        let sub = this.newmailsub.value
        let to = this.newmailto.value
        let text = this.newmailtext.value
        if(!to){
            Notify("送信先が見つかりませんでした")
            return
        }
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
        this.mailarea.classList.remove("disabled")
        this.newmailarea.classList.add("disabled")
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
        if(this.keep.type=="virus"){//ウイルス開いたのなら
            Task.Complete("Mail",true);//失敗
        }
    }
    deleteMail(){
        if(this.keep.type == "virus"){//ウイルスメール削除
            SystemConfigs.Result.Revenue += 100;
            SystemConfigs.Result.SecurityScore += 200;
            Task.Complete("Mail");
        }
        maillist = maillist.filter((item)=> {
            return item !== this.keep;
        });
        this.select([])
        this.mailarea.classList.add("disabled")
        this.refreshMails()
    }
    refreshMails(){
        if(JSON.stringify(SystemConfigs.connected_wifi) != "[]"){
            this.select([])
            this.maillist.innerHTML=""
            maillist.forEach((mail) =>{
                let temp = createElementFromHTML(`<div class="mailbox">
                        <p>${mail.from}</p>
                        <p>${mail.sub}</p>
                        <p style="color:gray">${mail.text}</p>
                    </div>`)
                temp.addEventListener('click',()=>{
                    this.select(mail)
                    if(!mail.read){ //未読メール
                        mail.read = true;
                        SystemConfigs.Result.Revenue += 100;
                    }
                })
                this.maillist.insertAdjacentElement('beforeend',temp)

                let menu = createElementFromHTML(`
                <ul>
                    <li>削除</li>
                </ul>
                `)
                menu.firstElementChild.addEventListener("click", () => {
                    this.keep = mail
                    this.deleteMail()
                })
                AddContextMenu(temp, menu)
            })
        }else{
            this.select({
                sub: "ネットワークに接続出来ませんでした",
                from:"SystemMessage",
                text: "ネットワークに接続出来ませんでした。\nWi-Fiに接続しているか、確認してください。"
            })
            this.maildelbutton.style.display="none"
        }
    }
}

SentToMeHandler["newMail"] = (mail)=>{
    maillist.push(mail)
}