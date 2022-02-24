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
      <textarea style="flex:1;resize:none;width:100%; height:100%;box-sizing:border-box;"></textarea>
    </div>
    <button style = "width:10%; height:100%; margin-left:2%;">
      検索
    </button>
  </div>
  <div style = "display:flex; width:100%; height:80%;">
    <div style = "width:25%; height:100%;">
      <div style = "width:100%; height:50%; font-size:8em; color:red; text-align:center;">
        ×
      </div>
      <div style = "width:100%; height:50%; font-size:2em; color:red; text-align:center;">
        DANGER
      </div>
    </div>
    <div style = "width:75%; height:100%;">
      <div style = "width:100%; height:10%; margin-top:2%; color:red; font-size:1.4em;">
        このサイトは危険です
      </div>
      <div style = "width:100%; height:10%; font-size:1.2em;">
        検出された脅威：
      </div>
      <div style = "display:flex; width:100%; height:10%; color:red;">
        <div style = "width:75%; height:100%;">フィッシング</div>
        <div style = "width:20%; height:100%; background:blue; color:white;">誤認を報告</div>
      </div>
      <div style = "width:100%; height:60%;">
        <div style = "width:100%; height:48%; margin-top:1%;border: 1px solid #c0c0c0;">
          <div style = "width:100%; height:20%; color:blue; background:#c0c0c0;">検索結果詳細</div>
          <div style = "display:flex; width:100%; height:22%;">
            <div style = "width:40%; height:100%;">
              hppp://newname.com/
            </div>
            <div style = "width:30%; height:100% color:red;">
              危険です
            </div>
            <div style = "width:30%; height:100%;">
              フィッシング
            </div>
          </div>
          <div style = "display:flex; width:100%; height:22%;">
            <div style = "width:40%; height:100%;">
              hppp://newname.com/
            </div>
            <div style = "width:30%; height:100% color:red;">
              危険です
            </div>
            <div style = "width:30%; height:100%;">
              フィッシング
            </div>
          </div>
          <div style = "display:flex; width:100%; height:22%;">
            <div style = "width:40%; height:100%;">
              hppp://newname.com/
            </div>
            <div style = "width:30%; height:100% color:red;">
              危険です
            </div>
            <div style = "width:30%; height:100%;">
              フィッシング
            </div>
          </div>
        </div>
        
        <div style = "width:100%; height:48%; margin-top:1%;border: 1px solid #c0c0c0;">
          <div style = "width:100%; height:20%; color:blue; background:#c0c0c0;">検出可能な脅威</div>

          <div style = "width:100%; height:80%;">
            フィッシング・ワンクリック・偽ソフトウェア・不正攻撃・不正改ざん・ウイルス・ワーム・スパイウェア・マルウェア
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

    /** @type {HTMLSelectElement} *///@ts-ignore
    this.subject = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling



  }
}