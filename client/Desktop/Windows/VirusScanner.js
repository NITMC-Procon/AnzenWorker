'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../Desktop.js"
import { Notify } from "../../Functions/notify.js"

const html = `
<div style="display: block;width: 100%;height: 100%;user-select:none;background-color:#3399cc">
  <div class="parent1">
    <div class="item1">コンピュータステータス - 保護済み</div>
  </div>
  <div class = "small-block">
    <div class = "item3">管理状態</div>
  </div>
  <div class="parent2">
    <div class = "item2">
      <ul>
        <li>ウイルススキャナーはあなたのPCを監視しています。</li>
      </ul>
      <div>
        <div class = "bad">×</div>
        <div class = "bad2">お使いのPCは危険な状態にさらされています。</div>
      </div>
      <div class = "block">
        <ul2>
          <li2>リアルタイム保護:  ON</li2>
        </ul2>
      </div>
      <div class = "block">
        <ul2>
          <li2>ウイルス & スパイウェア 定義: 最新</li2>
        </ul2>
      </div>
      <hr class = "line1">

    </div>
  </div>

</div>
<style>
  .parent1{
    text-align:center;
    width:100%;
  }
  .parent2{
    text-align:center;
    width:100%;
  }
  .small-block{
    width:100%;
    padding-top:40px;
    padding-left:50px;
  }
  .block{
    display:block;
    padding-top:20px;
    padding-left:80px;
    text-align: left;
  }
  .item1{
    background-color: #008000;
    display: inline-block;
    width:100%;
    height:25px;
    color:white;
  }
  .item2{
    background-color: #ffffff;
    display: inline-block;
    width:90%;
    height:260px;
  }
  .item3{
    background-color: #ffffff;
    display: inline-block;
    width:20%;
    height:25px;
    text-align: center;
    padding-top:10px;
  }
  ul {
  list-style-type: none;
  }
  li {
    position: relative;
    font-size:1em;
    text-align: center;
    padding-top:15px;
  }
  li::after {
    content: '';
    display: block;
    position: absolute;
    top: 0em;
    left: 0em;
    width: 35px;
    height: 20px;
    border-left: 20px solid #25AF01;
    border-bottom: 20px solid #25AF01;
    transform: rotate(-45deg);
  }
  ul3 {
  list-style-type: none;
  }
  li3 {
    position: relative;
    font-size:1em;
    text-align: center;
    padding-top:15px;
  }
  li3::after {
    content: '';
    display: block;
    position: absolute;
    top: 0em;
    left: 0em;
    width: 35px;
    height: 20px;
    border-left: 20px solid #ff0000;
    border-bottom: 20px solid #ff0000;
    transform: rotate(-45deg);
  }
  ul2 {
  list-style-type: none;
  }
  li2 {
    position: relative;
    text-align: left;
    border-bottom: 1px solid #c0c0c0;
  }
  li2::after {
    content: '';
    display: block;
    position: absolute;
    top: .5em;
    left: -1.5em;
    width: 10px;
    height: 5px;
    border-left: 2px solid #25AF01;
    border-bottom: 2px solid #25AF01;
    transform: rotate(-45deg);
  }
  hr.line1{
    margin-top:50px;
    background-color:c0c0c0;
  }
  .bad{
    display:inline-block;
    text-align:left;
    color: #ff0000;
    font-size:4em;
    width:60px;
  }
  .bad2{
    display:inline;
    width:200px;
  }
</style>`
const style = "width:40em;height:27em;"

export class VirusScanner extends Window {
  constructor() {
    super(html, "VirusScanner", { style: style });
    if (this.creationFailed) return


    /** @type {HTMLElement} *///@ts-ignore
    this.condition_var = this.bodyElem.firstElementChild.firstElementChild.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.item2 = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.supervise_check = this.item2.firstElementChild.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.bad1 = this.item2.firstElementChild.firstElementChild.nextElementSibling

    this.bad1.hidden = true

    for (var i = 0; i < SystemConfigs.installed_software.length; i++) {
      if (SystemConfigs.installed_software[i][1] == "danger") {
        this.inform_danger(SystemConfigs.installed_software[i])
      }
    }
  }
  // 不正ソフト検出 or 怪しいウイルス対策ソフト導入
  inform_danger(dangerous_software) {
    this.condition_var.style.backgroundColor = "#ff0000"
    this.condition_var.innerText = "コンピュータステータス - 危険な状態にあります"
    this.supervise_check.hidden = true
    this.bad1.hidden = false
  }

  inform_safe() {
    this.condition_var.style.backgroundColor = "#008000"
    this.condition_var.innerText = "コンピュータステータス - 保護済み"
    this.supervise_check.hidden = false
    this.bad1.hidden = true
  }
}

function createElementFromHTML(html) {
  let template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstElementChild;
}
