'use strict'
import { Window } from "../Window.js"

const html = `
<div style="display:flex; width: 100%; height:100%; background:white;">
  <div style = "height:100%; width:8%;">
    <div style = "height:12%; width:100%;">
      <div style = "height:5%; width:60%; margin-left:20%; background:black; margin-top:14%;"></div>
      <div style = "height:5%; width:60%; margin-left:20%; background:black; margin-top:14%;"></div>
      <div style = "height:5%; width:60%; margin-left:20%; background:black; margin-top:14%;"></div>
    </div>
    <div style = "position:relative; height:13%; width:100%;">
      <div style = "height:60%; width:60%; background:black; margin-left:20%; margin-top:10%;">
        <div style = "position:absolute; height:60%; width:60%; background:white; transform: rotate(45deg); left:1.5em; top:-1em;"></div>
        <div style = "position:absolute; height:60%; width:60%; background:white; transform: rotate(-45deg); left:-0.3em; top:-1em;"></div>
        <div style = "position:absolute; height:20%; width:20%; background:white; left:1.25em; top:1.55em;"></div>
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        ホーム
      </div>
    </div>
    <div style = "height:13%; width:100%;">
      <div style = "height:60%; width:60%; border-radius:50%; background:black; margin-left:20%; margin-top:20%;">
        <div style = "height:90%; width:90%; border-radius:50%; background:white; margin-left:5%; margin-top:10%;">
        </div>
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        探索
      </div>
    </div>
    <div style = "height:13%; width:100%;">
      <div style = "height:60%; width:60%;">
      
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        ショート
      </div>
    </div>
    <div style = "height:13%; width:100%;">
      <div style = "height:60%; width:60%;">
      
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        登録チャンネル
      </div>
    </div>
    <div style = "height:13%; width:100%;">
      <div style = "height:60%; width:60%;">
      
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        ライブラリ
      </div>
    </div>
  </div>
  <div style = "height:100%; width:90%;">
    <div style = "display:flex; height:10%; width:100%; border-bottom:1px solid gray;">
      <div style = "display:flex; width:20%; height:100%;">
        <img src = "../images/apps/MovieGetter.png" style = " height:80%; width:auto; margin-top:5%; margin-left:5%;">
        <div style = "width:50%; height:60%; margin-top:10%; margin-left:5%;">Yo!Tube</div>
      </div>
      <input type ="text" style="flex:1;resize:none;width:80%; height:80%;box-sizing:border-box; margin-left: 2%; margin-top:1%;"></input>
    </div>
    <div style = "display:flex; height:10%; width:100%;">
      <div style = "height:80%; width:12%; margin-left:2%; margin-top:1%; border-radius:50%; border: 1px solid gray; background:black;color:white; font-size:0.8em; text-align:center;">すべて</div>
      <div style = "height:80%; width:12%; margin-left:2%; margin-top:1%; border-radius:50%; border: 1px solid gray; background:#c0c0c0; font-size:0.8em; text-align:center;">ゲーム</div>
      <div style = "height:80%; width:17%; margin-left:2%; margin-top:1%; border-radius:50%; border: 1px solid gray; background:#c0c0c0; font-size:0.8em; text-align:center;">セキュリティ</div>
      <div style = "height:80%; width:12%; margin-left:2%; margin-top:1%; border-radius:50%; border: 1px solid gray; background:#c0c0c0; font-size:0.8em; text-align:center;">学習</div>
    </div>
    <div style = "height:80%; width:100%; background:#eeeeee; border-top:1px solid gray;">
      <div style = "display:flex; width:100%; height:48%;">
        <div style = "height:90%; width:30%; margin-left:2%; margin-top:2%; background:white;">
          <div style = "height:50%; width:100%;">
            <img class="login-icon" style="height:98%; margin-left:10%; margin-top:1%;" src="./images/login/logo.svg">
          </div>
          <div style = "height:28%; width:95%; margin:5%;">
            <div style ="font-size:0.7em;">セキュリティへの意識が高まる</div>
            <div style = "font-size:0.6em;">今すぐ安全仕事人をプレイし
            て身の回りに潜む脅威を体験しよう！</div>
          </div>
          <div style = "height:10%; width:20%; margin-left:5%; background:yellow; font-size:0.6em; text-align:center;">広告</div>
        </div>
        <div style = "height:90%; width:30%; margin-left:2%; margin-top:2%; background:white;">
          <div style = "height:60%; width:90%; margin-left:5%; margin-top:1%; background:black; color:white; text-align:center;">
            安全なWi-Fiの見分け方
          </div>
          <div style ="font-size:0.7em;">【必見！】安全なWi-Fiの見分け方を解説</div>
          <div style = "font-size:0.6em;">AnzenWork.Corp</div>
        </div>
        <div style = "height:90%; width:30%; margin-left:2%; margin-top:2%; background:white;">
          <div style = "height:60%; width:90%; margin-left:5%; margin-top:1%; background:black; color:white; text-align:center;">
            「ストアのアプリ」実は....
          </div>
          <div style ="font-size:0.7em;">ストアのアプリなら全部安全だと思っていませんか？</div>
          <div style = "font-size:0.6em;">AnzenWork.Corp</div>
        </div>
      </div>
      <div style = "display:flex; width:100%; height:48%;">
        <div style = "height:90%; width:30%; margin-left:2%; margin-top:2%; background:white;">
          <div style = "height:60%; width:90%; margin-left:5%; margin-top:1%; background:black; color:white; text-align:center;">
            【問題】どれが信頼できるメールでしょう？
          </div>
          <div style ="font-size:0.7em;">メールの仕分け方について解説しちゃいます！</div>
          <div style = "font-size:0.6em;">AnzenWork.Corp</div>
        </div>
        <div style = "height:90%; width:30%; margin-left:2%; margin-top:2%; background:white;">
          <div style = "height:60%; width:90%; margin-left:5%; margin-top:1%; background:black; color:white; text-align:center;">
            SNSの落とし穴！？
          </div>
          <div style ="font-size:0.7em;">5%の人しか知らないSNSの落とし穴とは？</div>
          <div style = "font-size:0.6em;">AnzenWork.Corp</div>
        </div>
        <div style = "height:90%; width:30%; margin-left:2%; margin-top:2%; background:white;">
          <div style = "height:60%; width:90%; margin-left:5%; margin-top:1%; background:black; color:white; text-align:center;">
            Excolのマクロって何？
          </div>
          <div style ="font-size:0.7em;">【⚠便利だけど危険？】Excolのマクロ機能</div>
          <div style = "font-size:0.6em;">AnzenWork.Corp</div>
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

export class YoTube extends Window {
  constructor() {
    super(html, "Yo!tube", { style: style });
    if (this.creationFailed) return


  }

}