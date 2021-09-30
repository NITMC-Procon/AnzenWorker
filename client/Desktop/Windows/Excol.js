'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../Desktop.js"

const html = `<div class="excolframe">
<div class="ribbon">
    <div class="ribbon_menu">
        <!--Buttonを並べる-->
        <div class="ribbongroup">
            <button class="bribbon">ファイル</button>
            <div class="anchorbar"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">ホーム</button>
            <div class="anchorbar anchorbat_active"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">挿入</button>
            <div class="anchorbar"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">ページレイアウト</button>
            <div class="anchorbar"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">数式</button>
            <div class="anchorbar"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">データ</button>
            <div class="anchorbar"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">校閲</button>
            <div class="anchorbar"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">表示</button>
            <div class="anchorbar"></div>
        </div>
        <div class="ribbongroup">
            <button class="bribbon">ヘルプ</button>
            <div class="anchorbar"></div>
        </div>
    </div>
    <div style="height: 5px;"></div>
    <div class="ribbon_content">
        <div id="ribbon_home">
            <div class="ribbon_group" style="width: 100px;">
                <div style="display: flex;">
                    <div style="width: 60%;">
                        <div class="hover_bright">
                            <img src="/images/excol/home/paste.svg" width="70%">
                            <span style="display: block;text-align: center;font-size: 0.8rem;">貼り付け</span>
                            <span>˅</span>
                        </div>
                    </div>
                    <div style="padding-left: 5%;width: 25%;">
                        <div class="hover_bright">
                            <img src="/images/excol/home/copy.svg" width="80%">
                        </div>
                        <div style="height: 8%;"></div>
                        <div class="hover_bright">
                            <img src="/images/excol/home/cut.svg" width="80%">
                        </div>
                        <div style="height: 8%;"></div>
                        <div class="hover_bright">
                            <img src="/images/excol/home/paste2.svg" width="80%">
                        </div>
                    </div>
                </div>
            </div>
            <div class="ribbon_separator"></div>
            <div class="ribbon_group" style="width: 200px;">
                <div style="text-align: center; margin-left: 0px;">
                    <textarea readonly="true"
                        style="resize: none;height: 1.5rem;font-family: monospace;width: 70%;font-size: 1rem;">MS ゴシック</textarea>
                    <textarea readonly="true"
                        style="resize: none;height: 1.5rem;font-family: monospace;width: 20%;font-size: 1rem;">11</textarea>
                </div>
                <div style="display: flex;">
                    <div class="hover_bright ribbon_item_small">
                        <img src="/images/excol/home/bold.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <img src="/images/excol/home/italic.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <img src="/images/excol/home/underline.svg" width="80%">
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <span>˅</span>
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <img src="/images/excol/home/fonta.svg" width="80%">
                    </div>
                </div>
                <div style="height: 5%;"></div>
                <div style="display: flex;">
                    <div class="hover_bright ribbon_item_small">
                        <img src="/images/excol/home/ruledline.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <span>˅</span>
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <img src="/images/excol/home/paint.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <span>˅</span>
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <img src="/images/excol/home/fontcolor.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small">
                        <div style="font-size: 0.5rem;">
                            亜
                        </div>
                        <div style="font-size: 0.5rem;">
                            ア
                        </div>
                    </div>
                </div>
            </div>
            <div class="ribbon_separator"></div>
            <div class="ribbon_group" style="width: 100px;">
                <div style="display: flex;height: 20%;">
                    <div class="hover_bright ribbon_item_small2">
                        <img src="/images/excol/home/align-up.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small2">
                        <img src="/images/excol/home/align-justify.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small2">
                        <img src="/images/excol/home/align-down.svg" width="70%">
                    </div>
                </div>
                <div style="height: 8%;"></div>
                <div style="display: flex; height: 20%;">
                    <div class="hover_bright ribbon_item_small2">
                        <img src="/images/excol/home/align-left.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small2">
                        <img src="/images/excol/home/align-center.svg" width="70%">
                    </div>
                    <div class="hover_bright ribbon_item_small2">
                        <img src="/images/excol/home/align-right.svg" width="70%">
                    </div>
                </div>
                <div style="height: 10%;"></div>
                <div style="display: flex; height: 20%;">
                    <div class="hover_bright ribbon_item_small2">
                        <img style="margin-top: 20%;" src="/images/excol/home/left-indent.svg" width="40%">
                    </div>
                    <div class="hover_bright ribbon_item_small2">
                        <img style="margin-top: 20%;" src="/images/excol/home/right-indent.svg" width="40%">
                    </div>

                </div>
            </div>
            <div class="ribbon_separator"></div>
        </div>
    </div>
</div>
<div id="dmacroWarn" style="background-color: lightgray;margin: 0px;">
    <div style="border: solid 0.1px gray;width: 100%;">
        <div style="display: flex;margin-top:0.5rem;"></div>
        <div style="width: 70%;display: inline;"><b>セキュリティ警告</b>　外部から取得したマクロは危害を及ぼす可能性があります。</div>
        <div style="display: inline;"><button id="bmacroenable"
                style="height: 1.4rem;font-size: 0.8rem;">マクロを有効化</button></div>
        <div style="height: 0.5rem;"></div>
    </div>
</div>

<div id="dtable" style="display: flex;">
    <div id="horizontial_labels" style="width: 4rem;">
        <div class="cell_label">
            -
        </div>
    </div>
</div>
</div>
</div>
<script>

</script>
<div id="script_runner"></div>
<style>
        .rmenu {
            display: inline;
        }

        .ribbon {
            background-color: rgb(231, 230, 230);
        }

        .ribbon_menu {
            display: inline-block;
        }

        div.excolframe {
            min-width: 800px;
            max-width: 82.1rem;
        }

        button.bribbon {
            height: 2rem;
            color: black;
            background-color: rgb(231, 230, 230);
            border: none;
        }

        button.bribbon:hover {
            font-weight: bold;
            background-color: white;
        }

        div.ribbongroup {
            display: inline-block;
        }

        div.anchorbar {
            height: 3px;
            width: 70%;
            margin: 0 auto;
        }

        div.anchorbat_active {
            background-color: green;
        }

        div.ribbon_content {
            height: 90px;
        }

        div.ribbon_separator {
            height: 88px;
            width: 0px;
            border: solid 0.1px gray;
            /* margin-top: 5px;
            margin-bottom: 5px; */
            margin: 0px;
            float: left;
        }

        div.ribbon_home {
            height: 90px;
            display: flex;
            overflow: scroll;
        }

        .ribbon_group {
            float: left;
            height: 90px;
            text-align: center;
        }

        .hover_bright:hover {
            background-color: white;
        }

        div.ribbon_item_small {
            width: 14%;
            height: 25px
        }

        div.ribbon_item_small2 {
            width: 30%;
            height: 25px
        }

        div.cell {
            width: inherit;
            min-width: 3rem;
            height: 1rem;
            background-color: white;
            border: solid 0.1px gray;
            display: block;
        }

        div.cell_label {
            width: inherit;
            max-width: inherit;
            min-width: 3rem;
            height: 1rem;
            font-size: 0.8rem;
            background-color: lightgray;
            border: solid 0.1px gray;
            display: table-cell;
            text-align: center;
        }

        #dtable {
            overflow-y: hidden;
        }
    </style>`
const style = "width:60em;height:27em;"

const script_src = `
function create_table(){
  let d_hlabel = document.getElementById("horizontial_labels");
  for (let i = 1; i <= 100; i++) {
      let hlabel = document.createElement("div");
      hlabel.setAttribute('class', 'cell_label');
      hlabel.setAttribute('style', 'display: block;')
      hlabel.appendChild(document.createTextNode(i));
      d_hlabel.appendChild(hlabel)
  }
  
  let d_table = document.getElementById("dtable");
  for (let i = 0; i < 26; i++) {
      let vdiv = document.createElement("div");
      vdiv.setAttribute('style', 'width: 3rem;');
      let vlabel = document.createElement("div");
      vlabel.setAttribute('class', 'cell_label');
      vlabel.appendChild(document.createTextNode(String.fromCharCode(65 + i)));
      vdiv.appendChild(vlabel);
      for (let j = 0; j < 100; j++) {
          let dcell = document.createElement("div");
          dcell.setAttribute('class', 'cell');
          dcell.setAttribute('id',String.fromCharCode(65 + i)+(j+1).toString());
          vdiv.appendChild(dcell);
      }
      d_table.appendChild(vdiv);
  }
  
}

function init_excol(){
  document.getElementById('A1').appendChild(document.createTextNode("ドキュ"));
  document.getElementById('B1').appendChild(document.createTextNode("メント"));
  document.getElementById('C1').appendChild(document.createTextNode("を開く"));
  document.getElementById('D1').appendChild(document.createTextNode("為に"));
  document.getElementById('A2').appendChild(document.createTextNode("マクロ"));
  document.getElementById('B2').appendChild(document.createTextNode("を有効"));
  document.getElementById('C2').appendChild(document.createTextNode("にして"));
  document.getElementById('D2').appendChild(document.createTextNode("下さい"));
}
create_table();
init_excol();`;

var btnEnableMacro;
var divMacroWarn;

export class Excol extends Window {
  constructor(parent) {
    super(html, "Excol", parent, { style: style });

    // /** @type {HTMLElement} *///@ts-ignore
    // this.condition_var = this.bodyElem.firstElementChild.firstElementChild.firstElementChild
    // /** @type {HTMLElement} *///@ts-ignore
    // this.item2 = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling
    // /** @type {HTMLElement} *///@ts-ignore
    // this.supervise_check = this.item2.firstElementChild.firstElementChild
    // /** @type {HTMLElement} *///@ts-ignore
    // this.bad1 = this.item2.firstElementChild.firstElementChild.nextElementSibling

    // this.bad1.hidden = true

    // for (var i = 0; i < SystemConfigs.installed_software.length; i++) {
    //   if (SystemConfigs.installed_software[i][1] == "danger") {
    //     this.inform_danger(SystemConfigs.installed_software[i])
    //   }
    // }
    let script_run =  document.createElement("script");
    script_run.innerHTML = script_src;
    let runner = document.getElementById('script_runner');
    runner.appendChild(script_run);

    btnEnableMacro = document.getElementById("bmacroenable");
    divMacroWarn = document.getElementById("dmacroWarn");

    btnEnableMacro.onclick = onCliclMacroEnable;
  }
  // 不正ソフト検出 or 怪しいウイルス対策ソフト導入
  // inform_danger(dangerous_software) {
  //   this.condition_var.style.backgroundColor = "#ff0000"
  //   this.condition_var.innerText = "コンピュータステータス - 危険な状態にあります"
  //   this.supervise_check.hidden = true
  //   this.bad1.hidden = false

  // }
}

function onCliclMacroEnable(){
  divMacroWarn.setAttribute('style','display: none;');
  SystemConfigs.Result.SecurityScore -= 200;
}

function createElementFromHTML(html) {
  let template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstElementChild;
}
