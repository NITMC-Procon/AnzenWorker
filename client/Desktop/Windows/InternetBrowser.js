'use strict'
import { Window } from "../Window.js"

const html = `
<div style="width: 100%;height: 100%;display:flex;flex-direction: column;">
    <div style="display:flex;margin:0.2em;">
        <span>アドレス:</span>
        <input style="flex:1;">
        <button>Go</button>
    </div>
    <iframe src="https://www.maizuru-ct.ac.jp/" style="flex:1;">
    </iframe>
</div>
`
const style="width:40em;height:30em;"

export class InternetBrowser extends Window{
    constructor(parent){
        super(html,"InternetBrowser",parent,{style:style});
        /** @type {HTMLInputElement} *///@ts-ignore
        this.addressarea = this.bodyElem.firstElementChild.firstElementChild.firstElementChild.nextElementSibling
        /** @type {HTMLButtonElement} *///@ts-ignore
        this.gobutton = this.addressarea.nextElementSibling
        /** @type {HTMLIFrameElement} *///@ts-ignore
        this.iframe = this.bodyElem.firstElementChild.lastElementChild

        this.gobutton.addEventListener('click',()=>{
            this.iframe.setAttribute("src",this.addressarea.value);
        })

        this.addressarea.addEventListener('keypress',(e)=>{
            if (e.code === "Enter") {
                this.iframe.setAttribute("src",this.addressarea.value);
            }
        })

        this.iframe.addEventListener('load',()=>{
            if(this.iframe.getAttribute("src")){
                this.addressarea.value=this.iframe.getAttribute("src")
            }
            console.log(this.iframe.contentWindow.document)
        })
    }
}