'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../../System/System.js"
import { Notify } from "../../Functions/notify.js"

const html = `
<div style="display: block;width: 100%;height: 100%;user-select:none;background-color:#3399cc">
  <div class="parent1">
    <div class="item1">コンピュータステータス - 保護済み</div>
  </div>
  <div class = "small-block">
    <div class = "item3">管理状態</div>
    <div class = "item3">アップデート</div>
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
        <ul2>
          <li4>ウイルス & スパイウェア 定義: 更新があります</li4>
        </ul2>
        </ul2>
      </div>
      <hr class = "line1">
    </div>

    <div class = "item2">
      <div style="padding-top:15px; padding-bottom:10px;">ウイルスとスパイウェア定義の状況: 更新があります</div>
      <div style="font-size:0.9em; padding-bottom:20px;">ウイルスとスパイウェアの定義を更新し、自動であなたのコンピュータを守ります。</div>
      <div style = "display:flex;">
        <div class = "stats">
          <p>最終更新日: 2015/11/02</p>
          <p>ウイルス定義バージョン: 0.82</p>
          <p>スパイウェア定義バージョン: 0.82</p>
        </div>
        <div style="width:40%">
          <div class="update_btn">アップデート</div>
        </div>
      </div>
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
    background-color: linear-gradient(to bottom,rgb(35, 251, 147),rgb(0,224,89),rgb(0, 224,89),rgb(0, 224,89),rgb(0, 249,110),rgb(0,196,62));
    display: inline-block;
    width:100%;
    height:25px;
    color:white;
    border-bottom:2px solid #c0c0c0;
    text-shadow: 1px 2px 3px #808080;
  }
  .item2{
    background-color: #ffffff;
    border: 1px solid #c0c0c0;
    border-top: 1px solid #ffffff;
    display: inline-block;
    width:90%;
    height:260px;
  }
  .item3{
    background-color: #ffffff;
    border: 1px solid #c0c0c0;
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
  li4{
    position: relative;
    text-align: left;
    border-bottom: 1px solid #c0c0c0;
  }
  li4::after{
    content: '×';
    display: block;
    position: absolute;
    top: .2em;
    left: -1.5em;
    width: 10px;
    height: 5px;
    color:#ff0000;
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
  .bad_2{
    display:inline-block;
    text-align:left;
    color: #ff0000;
    font-size:1.1em;
    width: 10px;
    height: 5px;
  }
  .bad2{
    display:inline;
    width:200px;
  }
  .bad3{
    display:flex;
    width:50px;
  }
  .is_hidden{
    display:none;
  }
  .stats{
    width:50%;
    padding-left:50px;
    font-size:0.9em;
    text-align: left;
  }
  .update_btn{
    width:8em;
    height:2em;
    background-color:#ffffff;
    border:2px solid #3399cc;
    text-align: center;
    margin-top:2em;
    border-radius: 6px;
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
    this.home_tab = this.item2.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.update_tab = this.home_tab.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.supervise_check = this.item2.firstElementChild.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.bad1 = this.item2.firstElementChild.firstElementChild.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.home = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.update = this.home.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.parent2 = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.block = this.parent2.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.up_to_date = this.block.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.out_of_date = this.up_to_date.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.update_cond = this.parent2.firstElementChild.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.update_btn = this.parent2.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.update_date = this.parent2.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.virus_version = this.update_date.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.spyware_version = this.virus_version.nextElementSibling

    var soft_num = this.reset();

    for (var i = 0; i < SystemConfigs.installed_software.length; i++) {
      if (SystemConfigs.installed_software[i][1] == "danger") {
        this.inform_danger(SystemConfigs.installed_software[i])
      }
    }

    this.home.addEventListener('click', () => {
      this.home_tab.classList.remove('is_hidden')
      this.update_tab.classList.add('is_hidden')
      this.home.style.backgroundColor = "#ffffff";
      this.home.style.borderBottomColor = "#ffffff";
      this.update.style.backgroundColor = "#c0c0c0";
      this.update.style.borderBottomColor = "#c0c0c0";
    })

    this.update.addEventListener('click', () => {
      this.home_tab.classList.add('is_hidden')
      this.update_tab.classList.remove('is_hidden')
      this.home.style.backgroundColor = "#c0c0c0";
      this.home.style.borderBottomColor = "#c0c0c0";
      this.update.style.backgroundColor = "#ffffff";
      this.update.style.borderBottomColor = "#ffffff";
    })

    this.update_btn.addEventListener('click', () => {
      this.update_cond.innerText = "ウイルスとスパイウェア定義の状況: 最新";
      this.inform_safe();
      this.up_to_date.classList.remove('is_hidden')
      this.out_of_date.classList.add('is_hidden')
      this.update_date.innerText = "最終更新日: " + get_today();
      this.virus_version.innerText = "ウイルス定義バージョン: 1.25";
      this.spyware_version.innerText = "スパイウェア定義バージョン: 1.25";
      this.update_btn.innerText = "最新版です"
      SystemConfigs.installed_software[soft_num][3] = get_today()
      this.update_btn.style.backgroundColor = "#c0c0c0";
    })
  }

  // 初期化
  reset() {
    this.home_tab.classList.remove('is_hidden')
    this.update_tab.classList.add('is_hidden')
    this.up_to_date.classList.add('is_hidden');

    this.condition_var.style.backgroundColor = "#ff0000"
    this.condition_var.innerText = "コンピュータステータス - 危険な状態にあります"
    this.supervise_check.hidden = true
    this.bad1.hidden = false

    this.home.style.backgroundColor = "#ffffff";
    this.home.style.borderBottomColor = "#ffffff";
    this.update.style.backgroundColor = "#c0c0c0";
    this.update.style.borderBottomColor = "#c0c0c0";

    for (var i = 0; i < SystemConfigs.installed_software.length; i++) {
      if (SystemConfigs.installed_software[i][2] == "security") {
        if (SystemConfigs.installed_software[i][3] == get_today()) {
          this.update_cond.innerText = "ウイルスとスパイウェア定義の状況: 最新";
          this.inform_safe();
          this.up_to_date.classList.remove('is_hidden')
          this.out_of_date.classList.add('is_hidden')
          this.update_date.innerText = "最終更新日: " + get_today();
          this.virus_version.innerText = "ウイルス定義バージョン: 1.25";
          this.spyware_version.innerText = "スパイウェア定義バージョン: 1.25";
          this.update_btn.innerText = "最新版です"
          SystemConfigs.installed_software[i][3] = get_today()
          this.update_btn.style.backgroundColor = "#c0c0c0";
        }
      }
      return i;
    }
  }

  // 不正ソフト検出 or 怪しいウイルス対策ソフト導入
  inform_danger(dangerous_software) {
    this.condition_var.style.background = "linear-gradient(to right,rgb(150,0,62),rgb(180,0,89),rgb(200,0,89),rgb(210,0,89),rgb(180,0,110),rgb(190,0,62))"
    this.condition_var.innerText = "コンピュータステータス - 危険な状態にあります"
    this.supervise_check.hidden = true
    this.bad1.hidden = false
  }

  inform_safe() {
    this.condition_var.style.background = "linear-gradient(to right,rgb(0,150,62),rgb(0,180,89),rgb(0, 200,89),rgb(0, 210,89),rgb(0, 180,110),rgb(0,190,62))";
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

function get_today() {
  //今日の日付データを変数に格納
  //変数は"today"とする
  var today = new Date();

  //年・月・日・曜日を取得
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();

  //年・月・日・曜日を書き出す
  return (year + "/" + month + "/" + day);
}