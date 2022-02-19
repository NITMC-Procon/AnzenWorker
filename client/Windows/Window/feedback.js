'use strict'
import { Window } from "../Window.js"

const html = `
<div style="width: 100%;height: 100%;user-select:none;">
  <div style = "display: flex; height:13%; width:100%; margin-top:2%;">
    <div style ="width:10%; height:100%; margin-left:2%;">
      <img src = "../images/apps/Feedback.png" height=100% width:auto></img>
    </div>
    <div style ="width:86%; height:100%; margin-left:2%; font-size:2em; ">安全仕事人 フィードバック</div>
  </div>

  <div style = "display: flex;width:98%; height:8%; margin-left:2%; margin-top:3%;">
    <div style ="width:auto; height:100%; font-size:1.5em; margin-left:3%; margin-right:2%;">
      フィードバックの種類
    </div>
    <select name="subject">
      <option value = "tho">感想</option>
      <option value = "sug">提案</option>
      <option value = "pro">バグ・問題</option>
      <option value = "oth">その他</option>
    </select>
  </div>

  <div style = "width:94%; height:63%; background:white; margin-left:3%; margin-top:2%;">
    <div style = "display:flex; width:100%; height:20%;">
      <div style = "width:auto; height:60%;font-size:1.2em; margin-left:2em; margin-top:1em;">満足度</div>
      <div style = "display:flex; width:20%; height:60%;margin-left:2em; margin-top:0.7em;">
        <div style = "width:20%; height:100%; color: #CCCCCC; font-size:1.7em; text-shadow: 1px 2px 3px #808080;">★</div>
        <div style = "width:20%; height:100%; color: #CCCCCC; font-size:1.7em; text-shadow: 1px 2px 3px #808080;">★</div>
        <div style = "width:20%; height:100%; color: #CCCCCC; font-size:1.7em; text-shadow: 1px 2px 3px #808080;">★</div>
        <div style = "width:20%; height:100%; color: #CCCCCC; font-size:1.7em; text-shadow: 1px 2px 3px #808080;">★</div>
        <div style = "width:20%; height:100%; color: #CCCCCC; font-size:1.7em; text-shadow: 1px 2px 3px #808080;">★</div>
      </div>
    </div>
    <div style = "width:100%; height:60%; margin-top:0.5em;">
      <div style = "margin-left:2em;">ご意見・ご感想がございましたら、ぜひご記入ください</div>
      <textarea style="flex:1;resize: none;width:90%;height:80%;box-sizing:border-box;margin-left:5%;"></textarea>
    </div>
    <button style = "margin-left:46%; margin-top:0.2em;">送信</button>
  </div>

  <div style = "width:94%; height:63%; background:white; margin-left:3%; margin-top:2%;">
    <div style = "display:flex; width:100%; height:20%;">
      <div style = "width:10%; height:60%;font-size:1.2em; margin-left:2em; margin-top:1em;">提案</div>
      <textarea style="resize: none;width:70%;height:60%;box-sizing:border-box;margin-left:2em; margin-top:1em;"></textarea>  
    </div>
    <div style = "width:100%; height:60%; margin-top:0.5em;">
      <div style = "margin-left:2em;">提案の内容</div>
      <textarea style="flex:1;resize: none;width:90%;height:80%;box-sizing:border-box;margin-left:5%;"></textarea>
    </div>
    <button style = "margin-left:46%; margin-top:0.2em;">送信</button>
  </div>

  <div style = "width:94%; height:63%; background:white; margin-left:3%; margin-top:2%;">
    <div style = "display:flex; width:100%; height:20%;">
      <div style = "width:auto; height:60%;font-size:1.2em; margin-left:2em; margin-top:1em;">発生した問題・バグ</div>
      <textarea style="resize: none;width:50%;height:60%;box-sizing:border-box;margin-left:2em; margin-top:1em;"></textarea>  
    </div>
    <div style = "width:100%; height:60%; margin-top:0.5em;">
      <div style = "margin-left:2em;">問題が生じた状況・症状など</div>
      <textarea style="resize: none;width:90%;height:80%;box-sizing:border-box;margin-left:5%;"></textarea>
    </div>
    <button style = "margin-left:46%; margin-top:0.2em;">送信</button>
  </div>

  <div style = "width:94%; height:63%; background:white; margin-left:3%; margin-top:2%;">
    <div style = "display:flex; width:100%; height:20%;">
      <div style = "width:auto; height:60%;font-size:1.2em; margin-left:2em; margin-top:1em;">その他</div>
      <textarea style="resize: none;width:70%;height:60%;box-sizing:border-box;margin-left:2em; margin-top:1em;"></textarea>  
    </div>
    <div style = "width:100%; height:60%; margin-top:0.5em;">
      <div style = "margin-left:2em;">コメント</div>
      <textarea style="flex:1;resize: none;width:90%;height:80%;box-sizing:border-box;margin-left:5%;"></textarea>
    </div>
    <button style = "margin-left:46%; margin-top:0.2em;">送信</button>
  </div>
</div>

<style>
  .is_hidden{
    display: none;
  }
  </style>`
const style = "width:40em;height:27em;"

export class Feedback extends Window {
  constructor() {
    super(html, "Feedback", { style: style });
    if (this.creationFailed) return

    /** @type {HTMLSelectElement} *///@ts-ignore
    this.subject = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling

    // 各題の表示ページ
    this.tho = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling
    this.sug = this.tho.nextElementSibling
    this.pro = this.sug.nextElementSibling
    this.oth = this.pro.nextElementSibling

    // 各題の送信ボタン
    this.tho_btn = this.tho.firstElementChild.nextElementSibling.nextElementSibling
    this.sug_btn = this.sug.firstElementChild.nextElementSibling.nextElementSibling
    this.pro_btn = this.pro.firstElementChild.nextElementSibling.nextElementSibling
    this.oth_btn = this.oth.firstElementChild.nextElementSibling.nextElementSibling

    // 各題のタイトル
    /** @type {HTMLInputElement} *///@ts-ignore
    this.sug_sub = this.sug.firstElementChild.firstElementChild.nextElementSibling
    /** @type {HTMLInputElement} *///@ts-ignore
    this.pro_sub = this.pro.firstElementChild.firstElementChild.nextElementSibling
    /** @type {HTMLInputElement} *///@ts-ignore
    this.oth_sub = this.oth.firstElementChild.firstElementChild.nextElementSibling

    // 各題の本文
    /** @type {HTMLInputElement} *///@ts-ignore
    this.tho_text = this.tho.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling
    /** @type {HTMLInputElement} *///@ts-ignore
    this.sug_text = this.sug.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling
    /** @type {HTMLInputElement} *///@ts-ignore
    this.pro_text = this.pro.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling
    /** @type {HTMLInputElement} *///@ts-ignore
    this.oth_text = this.oth.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling

    // 感想の評価の★
    /** @type {HTMLElement} *///@ts-ignore
    this.star1 = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
    /** @type {HTMLElement} *///@ts-ignore
    this.star2 = this.star1.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.star3 = this.star2.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.star4 = this.star3.nextElementSibling
    /** @type {HTMLElement} *///@ts-ignore
    this.star5 = this.star4.nextElementSibling

    var rep = -1;

    // ブルダウン選択
    this.subject.addEventListener('click', () => {
      if (this.subject.value == "tho") {
        this.tho.classList.remove('is_hidden')
        this.sug.classList.add('is_hidden')
        this.pro.classList.add('is_hidden')
        this.oth.classList.add('is_hidden')
      }
      else if (this.subject.value == "sug") {
        this.tho.classList.add('is_hidden')
        this.sug.classList.remove('is_hidden')
        this.pro.classList.add('is_hidden')
        this.oth.classList.add('is_hidden')
      }
      else if (this.subject.value == "pro") {
        this.tho.classList.add('is_hidden')
        this.sug.classList.add('is_hidden')
        this.pro.classList.remove('is_hidden')
        this.oth.classList.add('is_hidden')
      }
      else if (this.subject.value == "oth") {
        this.tho.classList.add('is_hidden')
        this.sug.classList.add('is_hidden')
        this.pro.classList.add('is_hidden')
        this.oth.classList.remove('is_hidden')
      }
    })

    // 評価の星の選択
    this.star1.addEventListener('click', () => {
      this.star1.style.color = "#ffcf32"
      this.star2.style.color = "#cccccc"
      this.star3.style.color = "#cccccc"
      this.star4.style.color = "#cccccc"
      this.star5.style.color = "#cccccc"
      rep = 1;
    })
    this.star2.addEventListener('click', () => {
      this.star1.style.color = "#ffcf32"
      this.star2.style.color = "#ffcf32"
      this.star3.style.color = "#cccccc"
      this.star4.style.color = "#cccccc"
      this.star5.style.color = "#cccccc"
      rep = 2;
    })
    this.star3.addEventListener('click', () => {
      this.star1.style.color = "#ffcf32"
      this.star2.style.color = "#ffcf32"
      this.star3.style.color = "#ffcf32"
      this.star4.style.color = "#cccccc"
      this.star5.style.color = "#cccccc"
      rep = 3;
    })
    this.star4.addEventListener('click', () => {
      this.star1.style.color = "#ffcf32"
      this.star2.style.color = "#ffcf32"
      this.star3.style.color = "#ffcf32"
      this.star4.style.color = "#ffcf32"
      this.star5.style.color = "#cccccc"
      rep = 4;
    })
    this.star5.addEventListener('click', () => {
      this.star1.style.color = "#ffcf32"
      this.star2.style.color = "#ffcf32"
      this.star3.style.color = "#ffcf32"
      this.star4.style.color = "#ffcf32"
      this.star5.style.color = "#ffcf32"
      rep = 5;
    })

    // 送信ボタン
    this.tho_btn.addEventListener('click', () => {
      if (rep != -1) {
        // tho_text 送信
      }
    })
    this.sug_btn.addEventListener('click', () => {
      // sug_sub / sub_text 送信
    })
    this.pro_btn.addEventListener('click', () => {
      // pro_sub / pro_text 送信
    })
    this.oth_btn.addEventListener('click', () => {
      // oth_sub / oth_text 送信
    })

  }
}