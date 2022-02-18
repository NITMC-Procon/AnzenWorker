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
      <div style = "width:50%; height:100%; margin-left:1em; margin-top:0.5em;">
        <div class="star5_rating" data-rate="3"></div>
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
      <div style = "width:auto; height:60%;font-size:1.2em; margin-left:2em; margin-top:1em;">提案の題</div>
      <textarea style="flex:1;resize: none;height:60%;box-sizing:border-box;margin-left:2em; margin-top:1em;"></textarea>  
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
      <textarea style="flex:1;resize: none;height:60%;box-sizing:border-box;margin-left:2em; margin-top:1em;"></textarea>  
    </div>
    <div style = "width:100%; height:60%; margin-top:0.5em;">
      <div style = "margin-left:2em;">問題が生じた状況・症状など</div>
      <textarea style="flex:1;resize: none;width:90%;height:80%;box-sizing:border-box;margin-left:5%;"></textarea>
    </div>
    <button style = "margin-left:46%; margin-top:0.2em;">送信</button>
  </div>

  <div style = "width:94%; height:63%; background:white; margin-left:3%; margin-top:2%;">
    <div style = "display:flex; width:100%; height:20%;">
      <div style = "width:auto; height:60%;font-size:1.2em; margin-left:2em; margin-top:1em;">その他</div>
      <textarea style="flex:1;resize: none;height:60%;box-sizing:border-box;margin-left:2em; margin-top:1em;"></textarea>  
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
  .star5_rating{
    position: relative;
    z-index: 0;
    display: inline-block;
    white-space: nowrap;
    color: #CCCCCC; /* グレーカラー 自由に設定化 */
    font-size: 2em;
  }
  .star5_rating:before, .star5_rating:after{
    content: '★★★★★';
  }
  .star5_rating:after{
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    overflow: hidden;
    white-space: nowrap;
    color: #ffcf32; /* イエローカラー 自由に設定化 */
  }
  .star5_rating[data-rate="5"]:after{ width: 100%; } /* 星5 */
  .star5_rating[data-rate="4"]:after{ width: 80%; } /* 星4 */
  .star5_rating[data-rate="3"]:after{ width: 60%; } /* 星3 */
  .star5_rating[data-rate="2"]:after{ width: 40%; } /* 星2 */
  .star5_rating[data-rate="1"]:after{ width: 20%; } /* 星1 */
  .star5_rating[data-rate="0"]:after{ width: 0%; } /* 星0 */

  </style>`
const style = "width:40em;height:27em;"

export class Feedback extends Window {
  constructor() {
    super(html, "Feedback", { style: style });
    if (this.creationFailed) return

    /** @type {HTMLSelectElement} *///@ts-ignore
    this.subject = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling

    this.tho = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling
    this.sug = this.tho.nextElementSibling
    this.pro = this.sug.nextElementSibling
    this.oth = this.pro.nextElementSibling

    this.tho_btn = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling
    this.sug_btn = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling
    this.pro_btn = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling
    this.oth_btn = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling


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

    // 送信ボタン
    this.tho_btn.addEventListener('click', () => {

    })
    this.sug_btn.addEventListener('click', () => {

    })
    this.pro_btn.addEventListener('click', () => {

    })
    this.oth_btn.addEventListener('click', () => {

    })

  }
}