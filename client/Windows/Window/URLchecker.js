'use strict'
import { Window } from "../Window.js"

const html = `
<div style="width: 100%;height: 100%;user-select:none;">
  <div style = "width:90%: height:10%; margin-left:2%; font-size:1.7em; color:red; margin-bottom:0.5em;">
    Webサイトの安全性をチェック
  </div>
  <div style = "display:flex; width:100%; height:10%;">
    <div style = "width:20%;height:80%;font-size:1.4em;text-align:center;margin-left:2%;margin-top:1%;">URLを入力</div>
    <div style = "width:60%; height:100%; margin-left:2%; margin-left:2%;">
      <input type ="text" style="flex:1;resize:none;width:100%; height:100%;box-sizing:border-box;"></input>
    </div>
    <button style = "width:10%; height:100%; margin-left:2%;">
      調査
    </button>
  </div>
  <div style = "display:flex; width:100%; height:80%;">
    <div style = "width:25%; height:100%;">
      <div style = "width:100%; height:50%; font-size:8em; color:green; text-align:center;">
        ○
      </div>
      <div style = "width:100%; height:50%; font-size:2em; color:green; text-align:center;">
        SAFE
      </div>
    </div>
    <div style = "width:75%; height:100%;">
      <div style = "width:100%; height:10%; margin-top:2%; color:green; font-size:1.4em;">
        このサイトは安全です
      </div>
      <div style = "width:100%; height:10%; font-size:1.2em;">
        検出された脅威：
      </div>
      <div style = "display:flex; width:100%; height:10%;">
        <div style = "width:75%; height:100%; color:green;">なし</div>
        <div style = "width:20%; height:100%; background:blue; color:white;">誤認を報告</div>
      </div>
      <div style = "width:100%; height:60%;">
        <div style = "width:95%; height:48%; margin-top:1%;border: 1px solid #c0c0c0;">
          <div style = "width:100%; height:22%; color:blue; background:#c0c0c0;">検索結果詳細</div>
          <div style = "display:flex; width:100%; height:26%;">
            <div style = "width:50%; height:100%;">
              hppp://newname.com/
            </div>
            <div style = "width:20%; height:100% color:green;">
              安全です
            </div>
            <div style = "width:30%; height:100%;">
              なし
            </div>
          </div>
        </div>
        
        <div style = "width:95%; height:48%; margin-top:1%;border: 1px solid #c0c0c0;">
          <div style = "width:100%; height:22%; color:blue; background:#c0c0c0;">検出可能な脅威</div>

          <div style = "width:100%; height:39%;">
            フィッシング・ワンクリック・偽ソフトウェア・不正攻撃
          </div>
          <div style = "width:100%; height:39%;">
            不正改ざん・ウイルス・ワーム・スパイウェア・マルウェア
          </div>
        </div>  
      </div>
    </div>
  </div>
</div>

<style>
  .is_hidden{
    display: none;
  }
  </style>`
const style = "width:40em;height:27em;"

export class URLchecker extends Window {
  constructor() {
    super(html, "URLchecker", { style: style });
    if (this.creationFailed) return

    /** @type {HTMLInputElement} *///@ts-ignore
    this.textbox = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild
    /** @type {HTMLInputElement} *///@ts-ignore
    this.button = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling

    this.box = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.sign = this.box.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.sign_text = this.sign.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.subject = this.box.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.content = this.subject.nextElementSibling.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.link = this.subject.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.safety = this.link.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.otho = this.safety.nextElementSibling

    var URLs = [
      ["http://www.web-research.omg", `フィッシング`],
    ]


    // 調査ボタン
    this.button.addEventListener('click', () => {
      var can = true;
      URLs.forEach(url => {
        if (url[0] == this.textbox.value || url[0] + "/" == this.textbox.value) {
          can = false;
          this.inform_danger(url);
        }
      });

      if (can) {
        this.inform_safe(this.textbox.value)
      }
    })

  }
  inform_danger(url) {
    this.sign.innerText = "×";
    this.sign.style.color = "red";
    this.sign_text.innerText = "DANGER";
    this.sign_text.style.color = "red";
    this.subject.innerText = "このサイトは危険です";
    this.subject.style.color = "red";
    this.content.innerText = url[1];
    this.content.style.color = "red";
    this.link.innerText = url[0];
    this.safety.innerText = "危険です";
    this.safety.style.color = "red";
    this.otho.innerText = url[1];
  }
  inform_safe(url) {
    this.sign.innerText = "○";
    this.sign.style.color = "green";
    this.sign_text.innerText = "SAFE";
    this.sign_text.style.color = "green";
    this.subject.innerText = "このサイトは安全です";
    this.subject.style.color = "green";
    this.content.innerText = "なし";
    this.content.style.color = "green";
    this.link.innerText = url;
    this.safety.innerText = "安全です";
    this.safety.style.color = "green";
    this.otho.innerText = "なし";
  }
}