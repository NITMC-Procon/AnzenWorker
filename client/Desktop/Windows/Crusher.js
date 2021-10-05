'use strict'
import { Window,RandomData } from "../Window.js"

const divid = RandomData()

const html = `
<div ${divid}>
<h1 style="color:white;margin:0">LUCKY DAY</h1>
</div>
<style type="text/css">
    @keyframes rainbow {
      0% {
        background-color: #FF0040;
      }
      8% {
        background-color: #ff7f00;
      }
      16% {
        background-color: #ffff00;
      }
      25% {
        background-color: #7fff00;
      }
      33% {
        background-color: #00ff00;
      }
      42% {
        background-color: #00ff7f;
      }
      50% {
        background-color: #00ffff;
      }
      58% {
        background-color: #007fff;
      }
      66% {
        background-color: #0000ff;
      }
      75% {
        background-color: #7f00ff;
      }
      83% {
        background-color: #ff00ff;
      }
      92% {
        background-color: #ff007f;
      }
      100% {
        background-color: #ff0000;
      }
    }
    div[${divid}] {
      animation: rainbow 0.7s infinite;
      display: flex;
      justify-content: center;
      align-items: center;
      height:100%;
      user-select:none;
    }
  </style>
`
const style = "width: 20em;height: 15em;"
export class Crusher extends Window {
    constructor() {
        super(html, "You've done", {style:style ,no_xbutton: false,no_maxmizebutton:true,no_minimizebutton:true,no_resizable:true,window_id:"Crusher"+RandomData()})
        if(this.creationFailed)return
    }
    destructor(){
      new Crusher()
      return false
    }
}