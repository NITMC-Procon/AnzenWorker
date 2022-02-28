'use strict'
import { Window } from "../Window.js"
import { Browser } from "./Browser.js"

const html = `
<div style="width: 100%;height: 100%;user-select:none;background:linear-gradient(to right,rgb(150,0,62),rgb(180,0,89),rgb(200,0,89),rgb(210,0,89),rgb(180,0,110),rgb(190,0,62));">
  <div style = "height:2%;width:100%;"></div>
  <div style = "height:10%;width:100%;text-align:center;font-size:1.2em;color:white;">動画無料簡単ダウンロード</div>
  <div style = "height:auto;width:100%;text-align:center;margin-top:1%;color:white;">↓ ダウンロードしたい動画URLを入力してください</div>
  <input type ="text" style="flex:1;resize:none;width:80%; height:8%;box-sizing:border-box;margin-left:10%;"></input>
  <div style = "height:auto;width:100%;text-align:center;margin-top:1%; font-size:0.8em;color:white;">Login : 録画にログインが必要な場合にはログイン情報の入力を行ってください</div>
  <button style = "width:20%; height:8%; margin-left:40%; margin-top:1%;">START</button>

  <div style = "width:100%; height:54%; background:white; margin-top:2%;">
    <div style = "display:flex; width:100%; height:20%; margin:top:2%;">
      <button style = "width:20%; height:90%; background:green;margin-left:10%;margin-top:1%;">動画サイトへ</button>
      <div style = "width:65%; height:60%; margin-left:5%; margin-top:2%;">ボタンをクリックで動画サイトのリンクを開く</div>
    </div>

    <div style = "width:90%; height:68%; border: 1px solid #c0c0c0; margin-left:5%; margin-top:2%;">
      <div style = "width:100%; height:20%; background:#c0c0c0; text-align:center;">履歴</div>
      <div style = "width:100%; height:20%; border-bottom:1px solid #c0c0c0;"></div>
      <div style = "width:100%; height:20%; border-bottom:1px solid #c0c0c0;"></div>
      <div style = "width:100%; height:20%; border-bottom:1px solid #c0c0c0;"></div>
      <div style = "width:100%; height:20%;"></div>
    </div>
  </div>

  <div id = "popup" style = "position:absolute; z-index:2; left:0px; top:0px; width:100%; height:100%; background-color:rgba(0,0,0,0.60);">
    <div style = "width:60%; height:60%; margin:20%; background:white; border:2px solid #c0c0c0;">
      <div style = "width:90%;height:20%; text-align:center; margin-left:5%; margin-top:5%;">アップデートがあります</div>
      <div style = "width:90%;height:20%; text-align:center; margin-left:5%;">アプリの利用を始めるためにはこれらの追加コンテンツをダウンロードする必要があります</div>
      <div style = "width:90%;height:10%; text-align:center; margin-left:5%; margin-top:3%;">追加コンテンツ 202.1MB</div>
      <button style = "width:45%;height:15%; text-align:center;background:green;color:white;margin-left:27.5%;margin-top:2%;">今すぐダウンロード</button>
    </div>
  </div>
</div>

<style>
  .is_hidden{
    display: none;
  }
  </style>`
const style = "width:40em;height:27em;"

export class MovieGetter extends Window {
  constructor() {
    super(html, "MovieGetter", { style: style });
    if (this.creationFailed) return

    /** @type {HTMLElement} *///@ts-ignore
    this.dl_btn = this.bodyElem.firstElementChild.lastElementChild.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling

    // Protectの修正ボタン
    this.dl_btn.addEventListener('click', () => {
      new Browser('http://www.movie-getter.omg/addcontents/')
    })
  }

}