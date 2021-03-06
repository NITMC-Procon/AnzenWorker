'use strict'
import { Window } from "../Window.js"
import { contents } from "../../Services/Service/YoTubeContents.js"

const html = `
<div style="display:flex; width: 100%; height:100%; background:white;">
  <div style = "height:100%; width:8%;">
    <div class = "tab">
      <div style = "height:5%; width:60%; margin-left:20%; background:black; margin-top:14%;"></div>
      <div style = "height:5%; width:60%; margin-left:20%; background:black; margin-top:14%;"></div>
      <div style = "height:5%; width:60%; margin-left:20%; background:black; margin-top:14%;"></div>
    </div>
    <div id = "home" class = "tab">
      <div style = "height:60%; width:60%; background:black; margin-left:20%; margin-top:10%;">
        <div style = "position:absolute; height:60%; width:60%; background:white; transform: rotate(45deg); left:1.5em; top:-1em;"></div>
        <div style = "position:absolute; height:60%; width:60%; background:white; transform: rotate(-45deg); left:-0.3em; top:-1em;"></div>
        <div style = "position:absolute; height:20%; width:20%; background:white; left:1.25em; top:1.55em;"></div>
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        ホーム
      </div>
    </div>
    <div class = "tab">
      <div style = "height:60%; width:60%; border-radius:50%; background:black; margin-left:20%; margin-top:20%;">
        <div style = "height:90%; width:90%; border-radius:50%; background:white; margin-left:5%; margin-top:10%;">
        </div>
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        探索
      </div>
    </div>
    <div class = "tab">
      <div style = "height:60%; width:60%;">
      
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        ショート
      </div>
    </div>
    <div class = "tab">
      <div style = "height:60%; width:60%;">
      
      </div>
      <div style = "height:20%; width:100%;margin-top:5%;font-size:0.6em; text-align:center;">
        登録チャンネル
      </div>
    </div>
    <div class = "tab">
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
        <img src = "../images/apps/YoTube.png" style = " height:80%; width:auto; margin-top:5%; margin-left:5%;">
        <div style = "width:50%; height:60%; margin-top:10%; margin-left:5%;">Yo!Tube</div>
      </div>
      <input type ="text" style="flex:1;resize:none;width:80%; height:80%;box-sizing:border-box; margin-left: 2%; margin-top:1%;"></input>
    </div>
    <div style = "height:10%; width:100%;">
      <div style = "display:flex; height:100%; width:100%;">
        <div style = "height:80%; width:12%; margin-left:2%; margin-top:1%; margin-bottom:1%; border-radius:50%; border: 1px solid gray; background:black;color:white; font-size:0.8em; text-align:center;">すべて</div>
        <div style = "height:80%; width:12%; margin-left:2%; margin-top:1%; margin-bottom:1%; border-radius:50%; border: 1px solid gray; background:#c0c0c0; font-size:0.8em; text-align:center;">ゲーム</div>
        <div style = "height:80%; width:17%; margin-left:2%; margin-top:1%; margin-bottom:1%; border-radius:50%; border: 1px solid gray; background:#c0c0c0; font-size:0.8em; text-align:center;">セキュリティ</div>
        <div style = "height:80%; width:12%; margin-left:2%; margin-top:1%; margin-bottom:1%; border-radius:50%; border: 1px solid gray; background:#c0c0c0; font-size:0.8em; text-align:center;">学習</div>
      </div>
    </div>
    <div style = "height:80%; width:100%; background:#eeeeee; border-top:1px solid gray;">
      <div style = "display:flex; flex-wrap: wrap; width:100%; height:98%;">
        <div class = "box">
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
      </div>
    </div>
    <div style = "position:relative; height:90%; width:100%; background:#eeeeee; border-top:1px solid gray; z-index:10;">
      <div style = "display:flex; height:100%; width:100%;">
        <div style = "width:70%; height:100%;">
          <div style = "width:96%; height:68%; margin-left:2%; margin-top:2%; background:black;">
            <div style = "width:100%; height:90%;">
            
            </div>
            <div style = "display:flex; width:100%; height:10%; background:gray;">
              <div id = "left" style = "width:10%; height:100%; color:white; margin-left:10%;">
                <b>←</b>
              </div>
              <div id = "right" style = "width:10%; height:100%; color:white;">
                <b>→</b>
              </div>
            </div>
          </div>
          <div style = "width:90%; height:28%; margin-left:5%; margin-top:2%;">
            <div style = "width:100%; height:50%; border-bottom:1px solid gray;">
              <div style = "width:100%; height:50%;" id = "title">
                タイトル
              </div>
              <div style = "width:100%; height:50%; font-size:0.7em; color:gray;" id = "disc">
                678回視聴・2021/11/14
              </div>
            </div>
            <div style = "display:flex; width:100%; height:40%; margin-top:2%; z-index:9;">
              <img src = "../images/apps/Feedback.png" style = " height:80%; width:auto; margin-left:2%; margin-right:2%;">
              <div style = "width:40%; height:80%; margin-top:1.5%;">
                Anzenwork.Corp
              </div>
              <div id = "share" style = "width:20%; height:80%; margin-top:1.5%; margin-left:5%;">
                <div style = "display:flex; width:100%; height:100%;">
                  <div style = "width:1em; height:1em; margin-top:5%; transform:rotate(-90deg);">⤵</div>
                  <div style = "width:5em; height:1em; margin-top:1%; margin-left:6%;">share</div>
                </div>
              </div>
              <div id = "slink" style = "width:10em; height:auto; border:1px solid gray; ">
                <div id = "contents_url" style = "display:absolute; width:100%; height:100%; font-size:0.7em;">
                  https://yo-tube/watch?v=<br>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style = "width:30%; height:100%;">
          <div style = "display:flex; height:10%; width:100%;">
            <div style = "height:80%; width:30%; margin-left:2%; margin-top:1%; margin-bottom:1%; border-radius:50%; border: 1px solid gray; background:black;color:white; font-size:0.8em; text-align:center;">すべて</div>
            <div style = "height:80%; width:30%; margin-left:2%; margin-top:1%; margin-bottom:1%; border-radius:50%; border: 1px solid gray; background:#c0c0c0; font-size:0.8em; text-align:center;">学習</div>
          </div>

          <div style = "height:90%; width:100%">
            
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
  .tab{
    position:relative;
    height:13%;
    width:100%;
  }
  .tab:hover{
    background:#c0c0c0;
  }
  .box{
    height:45%;
    width:30%;
    margin-left:2%;
    margin-top:2%; 
  }
  .box:hover{
    background:white;
  }
  .box2{
    height:24%;
    width:100%;
  }
  .box2:hover{
    background:white;
  }
  </style>`
const style = "width:40em;height:27em;"
export class YoTube extends Window {
  constructor() {
    super(html, "Yo!tube", { style: style });
    if (this.creationFailed) return

    /** @type {HTMLElement} *///@ts-ignore

    this.recm = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling
    this.cont = this.recm.nextElementSibling
    this.container = this.cont.firstElementChild
    this.page2 = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.lastElementChild
    this.container2 = this.page2.firstElementChild.firstElementChild.nextElementSibling.lastElementChild
    this.display = this.page2.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    this.left = this.page2.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
    this.right = this.left.nextElementSibling

    let allcontents = ''
    let allrecommends = ''

    var pagenum = 0;

    this.page2.classList.add('is_hidden')
    document.getElementById('slink').classList.add('is_hidden');

    contents.forEach((cont) => {
      let container = `
        <div class = "box">
          <div style = "height:60%; width:90%; margin-left:5%; margin-top:1%; background:black; color:white; text-align:center;">
            ${cont.thumb}
          </div>
          <div style ="font-size:0.7em;">${cont.title}</div>
          <div style = "font-size:0.6em;">AnzenWork.Corp</div>
        </div>`
      let container2 = `
        <div class = "box2">
          <div style = "display:flex; width:100%; height:100%">
            <div style = "width:49%; height:84%; margin-left:1%; margin-top:2%; background:black;font-size:0.6em;color:white;">
              ${cont.thumb}
            </div>
            <div style = "width:49%; height:98%; margin-left:1%; margin-top:1%;">
              <div style = "width:100%; height:55%; font-size:0.6em;">
                ${fix_title(cont.title)}
              </div>
              <div style = "width:100%; height:15%; font-size:0.55em; color:gray;">
                AnzenWork.Corp
              </div>
              <div style = "width:100%; height:15%; font-size:0.55em; color:gray;">
                ${cont.disc}
              </div>
            </div>
          </div>
        </div>`
      allcontents += container
      allrecommends += container2
    })
    this.container.insertAdjacentHTML('beforeend', allcontents);
    this.container2.insertAdjacentHTML('beforeend', allrecommends);

    for (let i = 1; i < this.container.childElementCount; i++) {
      this.container.children[i].addEventListener('click', () => {
        // ホーム画面を非表示
        this.recm.classList.toggle('is_hidden');
        this.cont.classList.toggle('is_hidden');
        // スライドコンテンツを表示
        this.page2.classList.toggle('is_hidden');

        // 前のスライドコンテンツを削除
        let p = this.display.childElementCount;
        for (let k = 0; k < p; k++) {
          this.display.removeChild(this.display.firstElementChild);
        }

        // スライドコンテンツを追加
        this.display.insertAdjacentHTML('beforeend', contents[i - 1].pages);

        // シェアリンクを閉じる
        document.getElementById('share').classList.remove('is_hidden');
        document.getElementById('slink').classList.add('is_hidden');

        // リンクを更新
        document.getElementById('contents_url').innerHTML = "https://yo-tube/view?v=<br>" + contents[i - 1].link;

        // ページ番号をリセット
        pagenum = 0;
        // 1ページ目以外を非表示
        for (let k = 1; k < this.display.childElementCount; k++) {
          this.display.children[k].classList.add('is_hidden');
        }

        // 動画のタイトルなどのテキストを変更
        change_text(contents[i - 1])

        // おすすめのコンテンツ欄を更新
        for (let k = 0; k < this.container2.childElementCount; k++) {
          this.container2.children[k].classList.remove('is_hidden');
        }
        this.container2.children[i - 1].classList.add('is_hidden');
      })
    }

    for (let i = 0; i < this.container2.childElementCount; i++) {
      this.container2.children[i].addEventListener('click', () => {
        change_text(contents[i])

        // 前のスライドコンテンツを削除
        let p = this.display.childElementCount;
        for (let k = 0; k < p; k++) {
          this.display.removeChild(this.display.firstElementChild);
        }

        // スライドコンテンツを追加
        this.display.insertAdjacentHTML('beforeend', contents[i].pages);

        // シェアリンクを閉じる
        document.getElementById('share').classList.remove('is_hidden');
        document.getElementById('slink').classList.add('is_hidden');

        // リンクを更新
        document.getElementById('contents_url').innerHTML = "https://yo-tube/view?v=<br>" + contents[i].link;

        // ページ番号をリセット
        pagenum = 0;
        // 1ページ目以外を非表示
        for (let k = 1; k < this.display.childElementCount; k++) {
          this.display.children[k].classList.add('is_hidden');
        }

        // おすすめのコンテンツ欄を更新
        for (let k = 0; k < this.container2.childElementCount; k++) {
          this.container2.children[k].classList.remove('is_hidden');
        }
        this.container2.children[i].classList.add('is_hidden');
      })
    }

    document.getElementById('home').addEventListener('click', () => {
      this.recm.classList.remove('is_hidden');
      this.cont.classList.remove('is_hidden');
      this.page2.classList.add('is_hidden');
    })

    document.getElementById('share').addEventListener('click', () => {
      document.getElementById('share').classList.add('is_hidden');
      document.getElementById('slink').classList.remove('is_hidden');
    })

    this.left.addEventListener('click', () => {
      if (1 <= pagenum && pagenum <= (this.display.childElementCount)) {
        this.display.children[pagenum].classList.add('is_hidden');
        this.display.children[pagenum - 1].classList.remove('is_hidden');
        pagenum--;
      }
    })
    this.right.addEventListener('click', () => {
      if (0 <= pagenum && pagenum <= (this.display.childElementCount - 2)) {
        this.display.children[pagenum].classList.add('is_hidden');
        this.display.children[pagenum + 1].classList.remove('is_hidden');
        pagenum++;
      }
    })

  }
}
function change_text(cont) {
  document.getElementById('title').innerText = cont.title;
  document.getElementById('disc').innerText = cont.disc;
}

function fix_title(text) {
  var re = text.substr(0, 14);
  re = re + "...";
  return re;
}