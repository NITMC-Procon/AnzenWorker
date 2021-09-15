'use strict'
import { Window } from "../Window.js"
import { SystemConfigs,CallWindow } from "../Desktop.js"

const html = `
<div style="width: 100%;height: 100%;display:flex;flex-direction: column;">
    <div style="display:flex;margin:0.2em;">
        <span>アドレス:</span>
        <input style="flex:1;">
        <button>Go</button>
    </div>
    <iframe src="http://u-haru.com/" style="flex:1;" onLoad="alert(this.contentWindow.location);">
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

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}