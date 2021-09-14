'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../Desktop.js"

const html = `
<div style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;">
    <div style="width: 100%;">
    </div>
</div>
<style>
    .title{
        font-size:2em;
        padding-top: 10px;
        padding-left: 30px;
    }
    .list_container{
        display: inline-block;
        width: 150px;
        height: 202px;
        margin:0.7em 0.5em ;
        box-sizing: border-box;
        background-color: #f0f0f0;
        padding: 2px;
        user-select: none;
        align-items: center;
        border: 1px solid #cccccc;
    }
    .list_container.is-hidden{
        visibility: hidden;
    }
    .store_container{
        display: inline-block;
        width: 100%;
        height: 100%;
        margin:0em 0em ;
        box-sizing: border-box;
        background-color: #f0f0f0;
        padding: 2px;
        user-select: none;
        align-items: center;
        border: 1px solid #cccccc;
    }
    .app_icon{
        position:relative;
        top:5px;
        left:17px;
    }
    .star_icon{
        position:relative;
        top:-20px;
        left:10px;
    }
    .star5_rating{
    position: relative;
    z-index: 0;
    display: inline-block;
    white-space: nowrap;
    color: #CCCCCC; /* グレーカラー 自由に設定化 */
    /*font-size: 25px;  フォントサイズ 自由に設定化 */
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
const style = "width:54em;height:33em;"

export class Store extends Window {
    constructor(parent) {
        super(html, "Store", parent, { style: style });
        this.apps = this.get_apps()
        this.list_container = this.bodyElem.firstElementChild.firstElementChild
        this.store_container = this.bodyElem.firstElementChild.firstElementChild
        let allapp = ''

        allapp += `<div class = "title">
        おすすめアプリ
        </div>`

        this.apps.forEach((app) => {
            let container = `
            <div class="list_container">
                <div class = "app_icon">
                    <img src = '../images/apps/AntiVirus.png' width="110px" height="110px">
                </div>

                <h2 style="margin:0.2em 0.5em;font-size:1.2em;">${this.fix_app(app[0])}</h2>
                
                <div class = "star_icon">
                    <p>
                        <span class="star5_rating" data-rate=${app[1]}></span>
                    </p>
                </div>

                <h4 style="margin:-2em 0.5em;font-size:1.2em;">${app[2]}</h4>
            </div>`
            allapp += container
        })
        this.list_container.insertAdjacentHTML('beforeend', allapp)

        /*
        let container2 =
            `<div class = "store_container">
                <div class = "app_icon">
                    <img src = '../images/apps/AntiVirus.png' width="110px" height="110px">
                <div>
            </div>`
        */

        for (let i = 0; i < this.list_container.childElementCount; i++) {
            this.list_container.children[i].addEventListener('click', () => {
                this.list_container.classList.toggle('is-hidden')
            })
        }
        this.connecttxt = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
        /**@type {any} */
        this.connectbtn = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.lastElementChild
        this.connectbtn.addEventListener('click', () => {

        })


        // document.getElementById("gamestart_button").onclick = () => {this.game_button("start")};
        // this.bodyElem.firstElementChild.nextElementSibling.firstChild.addEventListener('click',() => {this.game_button("start")})
        // this.bodyElem.firstElementChild.nextElementSibling.lastElementChild.addEventListener('click',() => {this.game_button("stop")})
    }
    get_apps() {//アプリ一覧取得
        let apps = [
            ["AntiVirus", 4, "無料", "ウイルス対策ソフト\n誰にとっても使いやすくて信頼度も高い",
                "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック", "©Anti Virus Corporation"],
            ["EasyVirusScanner", 1, "無料", "Virusのすきゃんができる.\nすごく安心する.",
                "・Virusがみつかる.\n・コンピュータを防衛する", "不明"],
            ["app3", 1, "無料"],
            ["app4", 2, "無料"],
            ["AntiVirusPro", 3, "￥3,900", "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
                "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック", "©Anti Virus Corporation"],
            ["app6", 5, "無料"],
            ["app7", 5, "無料"],
            ["app8", 5, "無料"],
            ["app9", 5, "無料"],
            ["app10", 5, "無料"]
        ]
        return apps
    }
    // リスト画面でアプリ名表示
    fix_app(text) {
        text = text.replaceAll("\n", " ")
        text = text.substr(0, 12)
        return text
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}