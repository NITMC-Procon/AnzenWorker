'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../../System/Desktop.js"
import { Notify } from "../../Functions/notify.js"

const html = `
<div style="display: flex;width: 100%;height: 100%;user-select:none;background-color:#003366">
  <div style="width:20%;height:100%;">
    <div style="height:14%;color:#9999ff;font-size:0.8em;text-align: center;">
      PC-Cleaner V3 Free
    </div>
    <button class="tab" id="Care">
      <div style="height:50%;">
        <div class="circle">
          <div class="circle2">
            <div class="circle3"></div>
          </div>
        </div>
      </div>
      <div style="height:50%;color:#9999ff;text-align: center;">Care</div>
    </button>
    <button class="tab" id="Speedup">
      <div style="height:50%;">
        <div class="circle">
          <div class="circle2">
            <div class="stick"></div>
          </div>
        </div>
      </div>
      <div style="height:50%;color:#9999ff;text-align: center;">Speed Up</div>
    </button>
    <button class="tab" id="Protect">
      <div style="height:50%;">
        <div class="square"></div>
      </div>
      <div style="height:50%;color:#9999ff;text-align: center;">Protect</div>
    </button>
    <button class="tab" id="SoftwareUpdater">
      <div style="height:50%;">
        <div class="circle">
          <div class="circle2">
            <div class="arrow">
              <div class="stick2"></div>
            </div>
          </div>
        </div>
      </div>
      <div style="height:50%;color:#9999ff;text-align: center;">Software Updater</div>
    </button>
    <button class="tab" id="ActionCenter">
      <div style="height:50%;">
        <div style ="display:flex;height:50%">
          <div style = "height:100%;width:50%;">
            <div class ="square2"></div>
          </div>
          <div style = "height:100%;width:50%;">
            <div class ="square3"></div>
          </div>
        </div>
        <div style ="display:flex;height:50%">
          <div style = "height:100%;width:50%;">
            <div class ="square2"></div>
          </div>
          <div style = "height:100%;width:50%;">
            <div class ="square3"></div>
          </div>
        </div>
      </div>
      <div style="height:50%;color:#9999ff;text-align: center;">
        Action Center
      </div>
    </button>
    <div class="tab" id="Activate">
      <div style="height:50%;">
        <button class="square4">
          Activate Now
        </button>
      </div>
      <u style="height:50%;color:#9999ff;text-align: center;margin-left:17%">Enter code</u>
    </div>
  </div>

  <div style="width:80%;height:100%;">
    <div style="width:100%;height:15%;"></div>

    <div class="page">
      <div class="circle4">
        <div class = "circle5"></div>
        <div class = "stick3"></div>
        <div class = "stick4"></div>
        <div class = "stick5"></div>
        <div class = "circle6"></div>
        <div class = "circle7"></div>
        <div class = "circle8"></div>
        <div class = "circle9" id = "Scan_btn"></div>
        <div style = "position:absolute;color:white;left:0.9em;top:1.6em;font-size:2em;">SCAN</div>
      </div>
    </div>
    <div class="page">
      <div style = "text-align:center;color:white;font-size:2em;margin-top:0.5em;">50% Cleaned</div>
    </div>
  </div>
</div>

<style>
  .tab{
    position:relative;
    height:14%;
    width:100%;
    border:none;
    background-color:#003366;
  }
  .tab:hover{
    background-color:#224466;
  }
  .page{
    position:relative;
    height:37%;
    width:100%;
    border:none;
    background-color:#003366;
  }
  .circle{
    padding-top:2px;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background: #9999ff;
    margin-left: auto;
    margin-right: auto;
  }
  .circle2{
    width: 1.6em;
    height: 1.6em;
    border-radius: 50%;
    background: #003366;
    margin:auto;
    padding-top:0.5px;
    color:#003366;
  }
  .circle3{
    width: 0.8em;
    height: 0.8em;
    border-radius: 50%;
    background: #9999ff;
    margin:auto;
    padding-top:0.5px;
  }
  .circle4{
    position:relative;
    width: 9em;
    height: 9em;
    border-radius: 50%;
    background: aqua;
    margin:auto;
  }
  .circle5{
    position:absolute;
    width: 8em;
    height: 8em;
    border-radius: 50%;
    background: #003366;
    left:0.5em;
    top:0.5em;
  }
  .circle6{
    position:absolute;
    width: 7.8em;
    height: 7.8em;
    border-radius: 50%;
    background: blue;
    left:0.6em;
    top:0.6em;
  }
  .circle7{
    position:absolute;
    width: 7.2em;
    height: 7.2em;
    border-radius: 50%;
    background: #003366;
    left:0.9em;
    top:0.9em;
  }
  .circle8{
    position:absolute;
    width: 7.1em;
    height: 7.1em;
    border-radius: 50%;
    background: aqua;
    left:0.95em;
    top:0.95em;
  }
  .circle9{
    position:absolute;
    width: 6.9em;
    height: 6.9em;
    border-radius: 50%;
    background: #003366;
    left:1.05em;
    top:1.05em;
  }
  .circle9:hover{
    background-color:#224466;
  }
  .stick{
    position:relative;
    left:11px;
    width:0.1em;
    height:1.8em;
    transform:rotate(15deg);
    background: #9999ff;
  }
  .stick2{
    position:absolute;
    width:0.3em;
    height:1.4em;
    left:3.8px;
    top:-3px;
    background: #9999ff;
    transform: rotate(-45deg);
  }
  .stick3{
    position:absolute;
    width:1em;
    height:10em;
    background: #003366;
    left:3.5em;
    transform: rotate(-60deg);
  }
  .stick4{
    position:absolute;
    width:1em;
    height:11em;
    background: #003366;
    left:3.5em;
    transform: rotate(-120deg);
  }
  .stick5{
    position:absolute;
    width:1em;
    height:10em;
    background: #003366;
    left:3.5em;
  }
  .square{
    padding-top:2px;
    width: 1.8em;
    height: 1.8em;
    border-radius: 10%;
    background: #9999ff;
    margin-left: auto;
    margin-right: auto;
  }
  .square2{
    position:flex;
    padding-top:2px;
    width: 0.8em;
    height: 0.7em;
    border-radius: 10%;
    background: #9999ff;
    margin-left: auto;
    margin-right:0.1em;
  }
  .square3{
    position:flex;
    padding-top:2px;
    width: 0.8em;
    height: 0.7em;
    border-radius: 10%;
    background: #9999ff;
    margin-left:0.1em;
    margin-right: auto;
  }
  .square4{
    width: 80%;
    height: 90%;
    border-radius: 5%;
    background: #ff9900;
    margin-left: 10%;
    margin-right: 10%;
    margin-top:5%;
  }
  .arrow{
  display: inline-block;
  width: 9px;
  height: 9px;
  margin: 0 5px;
  border-top: 3px solid #9999ff;
  border-left: 3px solid #9999ff;
  transform: rotate(45deg);
  }
</style>`
const style = "width:40em;height:27em;"

export class PCcleaner extends Window {
  constructor() {
    super(html, "PC-Cleaner", { style: style });
    if (this.creationFailed) return

    /** @type {HTMLElement} *///@ts-ignore
    this.page = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.scan = this.page.nextElementSibling.firstElementChild.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.scanbtn = this.scan.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.text = this.page.nextElementSibling.nextElementSibling.firstElementChild

    this.scanbtn.addEventListener('click', () => {
      var rand = Math.round(((Math.random() * 100) % 100));
      this.text.innerText = rand + "% Cleaned";
    })
  }
}