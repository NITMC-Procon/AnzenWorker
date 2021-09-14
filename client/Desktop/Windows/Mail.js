'use strict'
import { Window } from "../Window.js"
import { SystemConfigs,CallWindow } from "../Desktop.js"

const html = `
<div style="display: flex;width: 100%;height: 100%;user-select:none;">
  <div style="width: 15em;overflow:auto;">
    <h2 style="padding: 0.2em;margin:0;text-align: center;">受信ボックス</h2>
    <div>
    </div>
  </div>
  <div class="mail">
    <h1 style="margin:0;">メール</h1>
    <div class="file" style="display:none;">file.exe</div>
    <p style="margin:2px 0 0 0"></p>
    <div class="file" style="display:none;">Delete</div>
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
    ["テストメール", `先生へ

4Fの太郎です。

例の物を添付ファイルとしてお送り致します。
ご確認の方よろしくお願いします。

舞鶴工業高等専門学校 機械制御情弱科 4年 舞鶴 太郎
Email: taro@maizuru.kosen.ac.jp`,"file.exe",()=>{ CallWindow("Crusher",Math.random())}], ["メール2", "本文2"]
]


export class Mail extends Window{
    constructor(parent){
        super(html,"WiFi",parent,{style:style});
        
        /** @type {HTMLElement} *///@ts-ignore
        this.maillist = this.bodyElem.firstElementChild.firstElementChild.lastElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.mailtitlearea = this.bodyElem.firstElementChild.lastElementChild.firstElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.mailfilearea = this.mailtitlearea.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.mailtextarea = this.mailfilearea.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.maildelbutton = this.mailtextarea.nextElementSibling

        this.refreshMails()
        
        this.mailfilearea.addEventListener('click',()=>{
            this.openfile()
        })
        this.maildelbutton.addEventListener('click',()=>{
            this.deleteMail()
        })
    }
    select(mail){
        this.keep = mail
        this.mailtitlearea.textContent = mail[0]?mail[0]:""
        //@ts-ignore
        this.mailtextarea.innerText = mail[1]?mail[1]:""
        if(mail[2]){
            this.mailfilearea.style.display=""
            this.mailfilearea.textContent = mail[2];
        }else{
            this.mailfilearea.style.display="none"
        }
        this.maildelbutton.style.display=(mail[1]?"":"none")
    }
    openfile(){
        if(this.keep && this.keep[3]){
            this.keep[3]()
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
                    <h2>${mail[0]}</h2>
                    <p>${mail[1]}</p>
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