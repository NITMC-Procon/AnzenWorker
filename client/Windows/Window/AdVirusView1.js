'use strict'
import { Window } from "../Window.js"
// @ts-ignore
import { SystemConfigs } from "../../System/Desktop.js"
// @ts-ignore
import { CallWindow } from "../../System/Desktop.js"


const html = `<div id="ｘaframe" style="width: 400px;height: 300px;background-color: red;text-align: center;">
<div id="step1">
    <div id="ad1">
        <img src="/images/virus/bikini_w_828.png" height="250px">
    </div>
    <div id="touroku" style="width: 400px;height: 50px;">
        <div id="tourokutext" style="width: 400px; font-size: 30px;text-align: center;">今すぐ登録</div>
    </div>
</div>
<div id="step2" style="background-color: red;color: black; display: none;">
    <div style="font-size: 30px;">ご登録頂きありがとうございました。入会金30万円を直ちに下記口座に振り込んでください</div>
    <div style="font-size: 20px;">二井住吉銀行 但馬支店 xxxxxxxxx番</div>
    <div style="font-size: 20px;">お電話: 080-xxxx-yyyy</div>
</div>
</div>`
const style = "width:400px;height:332px;"


export class AdVirusView1 extends Window {
  constructor() {
    super(html, "今すぐ会員登録", { style: style });
    if(this.creationFailed)return

    let touroku = document.getElementById('touroku');
    let tourokutext = document.getElementById('tourokutext');

    touroku.onclick = onClickRegist;

    let tourokuc = 0;
    setInterval(function () {
        blinktouroku();
    }, 500);
    function blinktouroku() {
        if (tourokuc++ % 2) {
            touroku.style.backgroundColor = "black";
            tourokutext.style.color = "white";
        } else {
            touroku.style.backgroundColor = "yellow";
            tourokutext.style.color = "black";
        }
        // setTimeout(function () {
        //     blinktouroku();
        // }, 500);
    }

    function onClickRegist() {
        document.getElementById('step2').style.display = "";
        document.getElementById('step1').style.display = "none";

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
