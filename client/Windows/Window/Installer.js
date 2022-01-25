'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../../System/Desktop.js"


const html = `<div class="installerframe" style="width: 800px;height: 600px;background-color: rgb(233, 233, 233);">
<div id="page1" class="page">
    <div id="main" style="height: 500px;display: flex;">
        <div style="width: 200px;background-color: teal;"></div>
        <div style="width: 600px;">
            <div style="margin: 50px;">
                <p>Hyper Video Downloader セットアップウィザードへようこそ</p>
                <p>Install Should ウィザードは、ご使用のコンピュータへHyper Video Downloaderをインストールします。「次へ」をクリックして、続行してください。</p>
                <p style="margin-top: 250px;">警告: このプログラムは、著作権法および国際協定によって保護されていません。</p>
            </div>
        </div>
    </div>
</div>
<div id="page2" class="page">
    <div id="header" style="height: 100px;background-color: white;">
        <div style="padding: 20px;">
            <p class="header">宛先フォルダ</p>
            <p class="header">「次へ」をクリックしてこのフォルダにインストールします。または、参照をクリックして宛先フォルダを変更します。</p>
        </div>
    </div>
    <div id="main" style="height: 400px;">
        <div style="padding: 40px;">
            <span>Hyper Video Downloaderのインストール先</span>
            <div style="display: flex;margin-top: 20px;height: 2rem;">
                <textarea style="resize: none;width: 400px;">C:\\Program Files\\Hyper Video Downloader\\</textarea>
                <div style="width: 30px;"></div>
                <button> 参照</button>
            </div>
        </div>
    </div>
</div>
<div id="page3" class="page">
    <div id="header" style="height: 100px;background-color: white;">
        <div style="padding: 20px;">
            <p class="header">インストール中...</p>
            <p class="header">コンピュータにインストールしています。</p>
        </div>
    </div>
    <div id="main" style="height: 400px;">
        <div style="padding: 40px;">
            <span>Hyper Video Downloaderのインストール中...</span>
                <progress id="progress" max="100" style="width: 700px;height: 50px;"></progress>
        </div>
    </div>
</div>
<div id="page4" class="page">
    <div id="header" style="height: 100px;background-color: white;">
        <div style="padding: 20px;">
            <p class="header">インストール完了</p>
            <p class="header">コンピュータに正常にインストールされました。</p>
        </div>
    </div>
    <div id="main" style="height: 400px;">
        <!-- <div style="padding: 40px;">
            <span>Hyper Video Downloaderのインストール中...</span>
                <progress id="progress" max="100" style="width: 700px;height: 50px;"></progress>
        </div> -->
    </div>
</div>

<div id="footer" style="height: 100px;background-color: whitesmoke;">
    <div style="text-align: right;padding: 10px">
        <button id="bnext" class="button_setup">次へ</button>
        <button id="bexit" class="button_setup">終了</button>
    </div>
    <div style="text-align: right;margin-top: 30px;">Hyper Video Downloader Installer</div>
</div>
</div>
<style>
.installframe{
    font-size: 1rem;
}

.button_setup {
    margin-left: 5px;
    margin-right: 5px;
    width: 6rem;
    height: 1.5rem;
}

.page {
    height: 500px;
}

p.header {
    font-size: 0.8rem;
}
</style>`
const style = "width:800px;height:600px;"


export class Installer extends Window {
  constructor() {
    super(html, "Installer", { style: style });
    if(this.creationFailed)return

    let ibutton_exit = document.getElementById('bexit');
    
    ibutton_exit.onclick = this.destroy.bind(this);

    let button_exit = document.getElementById("bexit");

    let button_next = document.getElementById("bnext");
    button_next.onclick = onClickNext;

    let current_page = 1;
    let page1 = document.getElementById('page1');
    let page2 = document.getElementById('page2')
    let page3 = document.getElementById('page3');
    let page4 = document.getElementById('page4');

    let pages = [page1, page2, page3, page4];

    function setPage(pagenum) {
        if (pagenum > 4 || pagenum < 1) {
            pagenum = 1;
        }
        for (let a = 1; a <= 4; a++) {
            if (a === pagenum) {
                pages[a - 1].removeAttribute('style');
            } else {
                pages[a - 1].setAttribute('style', 'display: none;');
            }
        }
        if(current_page === 3){
            // @ts-ignore
            button_next.disabled = true;
            // @ts-ignore
            button_exit.disabled = true;
            setTimeout(function(){
            completePage3();
            },3000);
        }
        if(current_page === 4){
            // @ts-ignore
            button_next.disabled = true;
            // @ts-ignore
            button_exit.disabled = false;
        }
    }

    function onClickNext() {
        if (current_page < 4) {
            setPage(++current_page);
            SystemConfigs.Result.SecurityScore -= 200;
        }
    }

    function completePage3(){
        let progress = document.getElementById('progress');
        progress.setAttribute('value','100');
        // @ts-ignore
        button_next.disabled = false;
        // button_exit.disabled = false;
        SystemConfigs.Result.SecurityScore -= 1000;
        if(!SystemConfigs.Result.Flag.includes("unwantedSoftware"))SystemConfigs.Result.Flag.push('unwantedSoftware');
    }

    setPage(1);
  }
}


// @ts-ignore
function createElementFromHTML(html) {
  let template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstElementChild;
}
