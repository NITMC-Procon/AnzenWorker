'use strict'
import { Window } from "../Window.js"
import { WormVirus } from "../../Viruses/VirusEvents.js"


const html = `<div style="width: 400px;height: 300px;background-color: black;color: white;">
Installing...
</div>`
const style = "width:400px;height:332px;"


export class OpenWorm extends Window {
  constructor() {
    super(html, "cmd.exe", { style: style });
    let self = this;
    if(this.creationFailed)return
    
    setTimeout(startworm,1000);

    function startworm(){
        new WormVirus();
        self.destroy();
    }
  }
}

// @ts-ignore
function createElementFromHTML(html) {
  let template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstElementChild;
}
