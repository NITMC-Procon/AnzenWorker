'use strict'
import { Window } from "../Window.js"
import { SystemConfigs, DesktopIconList, CallWindow, RefreshDesktop } from "../Desktop.js"
import { VirusScanner } from "./VirusScanner.js"

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
    .is_hidden{
        display:none;
    }
    .store_container{
        display:flex;
        width:750px;
        height:250px;
        margin:3em 3.5em;
    }
    .store_background{
        width:750px;
        height:250px;
        box-sizing:border-box;
        background-color:#ffffff;
        border: 1px solid #cccccc;
        user-select: none;
    }
    .app_icon{
        position:relative;
        top:5px;
        left:17px;
    }
    .app_icon2{
        position:absolute;
        left:120px;
        top:100px;
    }
    .title2{
        position:absolute;
        font-size:2em;
        top:80px;
        left:325px;
    }
    .copname{
        position:absolute;
        font-size:1em;
        color: #0000FF;
        top:115px;
        left:325px;
        white-space: nowrap;
    }
    .introduction{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:150px;
        left:330px;
    }
    .install_btn{
        white-space: pre;
        position:absolute;
        height:40px;
        left: 325px;
        top: 245px;
        box-sizing: border-box;
        background-color: #33cccc;
        margin:0em 0em;
        padding: 10px;
    }
    .price{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:220px;
        left:340px;
    }
    .detail{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:300px;
        left:400px;
    }
    .platform_subject{
        white-space: pre;
        position:absolute;
        font-size:1.6em;
        top:325px;
        left:100px;
    }
    .platform_text{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:370px;
        left:200px;
    }
    .author_subject{
        white-space: pre;
        position:absolute;
        font-size:1.6em;
        top:420px;
        left:100px;
    }
    .author_text{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        color: #0000FF;
        top:460px;
        left:100px;
    }
    .function_subject{
        white-space: pre;
        position:absolute;
        font-size:1.6em;
        top:325px;
        left:500px;
    }
    .function_text{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:370px;
        left:480px;
    }
    .backbtn{
        position:absolute;
        top:32px;
        left:0px;
        width: 57px;
        height: 50px;
        line-height: 50px;
        background-color: #808080;
        color: #fff;
    }
    .star_icon{
        position:relative;
        top:-20px;
        left:10px;
    }
    .star_icon2{
        position:absolute;
        top:190px;
        left:550px;
        font-size: 2em;
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

export let apps = [
    {
        name: "AntiVirus",
        star: 4,
        price: 0,
        introduction: "ウイルス対策ソフト\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security"
    }, {
        name: "EasyVirusScanner",
        star: 1,
        price: 0,
        introduction: "Virusのすきゃんができる.\nすごく安心する.",
        func: "・Virusがみつかる.\n・コンピュータを防衛する",
        corporation: "不明",
        safety: "danger",
        type: "security"
    }, {
        name: "AntiVirusPro",
        star: 3,
        price: 3900,
        introduction: "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security"
    }
]

export class Store extends Window {
    constructor() {
        super(html, "Store", { style: style });
        if(this.creationFailed)return

        this.list_container = this.bodyElem.firstElementChild.firstElementChild
        let allapp = ''
        this.selectapp = -1     //　選んだアプリを記憶

        allapp += `<div class = "title">
        おすすめアプリ
        </div>`

        apps.forEach((app) => {
            let container = `
            <div class="list_container">
                <div class = "app_icon">
                    <img src = '../images/apps/AntiVirus.png' width="110px" height="110px">
                </div>

                <h2 style="margin:0.2em 0.5em;font-size:1.2em;">${this.fix_app(app.name)}</h2>
                
                <div class = "star_icon">
                    <p>
                        <span class="star5_rating" data-rate=${app.star}></span>
                    </p>
                </div>

                <h4 style="margin:-2em 0.5em;font-size:1.2em;">${app.price ? "￥" + app.price : "無料"}</h4>
            </div>`
            allapp += container
        })
        let container2 = `
            <div class="store_container">
                <div class = "store_background">  </div>
                <div class = "app_icon2">
                    <img src = '../images/apps/AntiVirus.png' width="140px" height="140px">
                </div>

                <div class = "title2" id = "title2">AntiVirus</div>
                <div class = "copname" id = "corpname">©Anti Virus Corporation</div>
                <div class = "introduction" id = "introduction">
                ウイルス対策ソフト
                誰にとっても使いやすくて信頼度も高い</div>

                <div class = "install_btn" id = "install_btn">インストール
                </div>

                <div class = "price" id = "price">無料
                </div>

                <div class = "detail">概要</div>

                <div class = "platform_subject">対応プラットフォーム</div>
                <div class = "platform_text" id = "platform">PC</div>

                <div class = "author_subject">公開元・著作権</div>
                <div class = "author_text" id = "author">©Anti Virus Corporation</div>

                <div class = "function_subject">機能</div>
                <div class = "function_text" id = "function">
                ・ウイルスの定期スキャン
                ・ウイルス検出時の除去
                ・不審なソフトウェアのブロック</div>

                <div class = "backbtn">back</div>

            </div>`
        allapp += container2
        this.list_container.insertAdjacentHTML('beforeend', allapp)
        for (let j = 0; j < this.list_container.children[this.list_container.childElementCount - 1].childElementCount; j++) {
            this.list_container.children[this.list_container.childElementCount - 1].children[j].classList.toggle('is_hidden')
        }
        this.list_container.children[this.list_container.childElementCount - 1].classList.toggle('is_hidden')

        for (let i = 0; i < this.list_container.childElementCount - 1; i++) {
            this.list_container.children[i].addEventListener('click', () => {
                // 表示するオブジェクトを入れ替える
                for (let j = 0; j < this.list_container.childElementCount; j++) {
                    this.list_container.children[j].classList.toggle('is_hidden')
                }
                for (let j = 0; j < this.list_container.children[this.list_container.childElementCount - 1].childElementCount; j++) {
                    this.list_container.children[this.list_container.childElementCount - 1].children[j].classList.toggle('is_hidden')
                }
                this.list_container.children[this.list_container.childElementCount - 1].classList.toggle('is_hidden')

                // 選んだアプリを記憶
                this.selectapp = i - 1

                // テキスト変更
                this.change_text(apps[i - 1])

            })
        }
        // backボタンが押された時
        this.list_container.children[this.list_container.childElementCount - 1].children[this.list_container.children[this.list_container.childElementCount - 1].childElementCount - 1].addEventListener('click', () => {
            // 表示するオブジェクトを入れ替える
            for (let j = 0; j < this.list_container.childElementCount; j++) {
                this.list_container.children[j].classList.toggle('is_hidden')
            }
            for (let j = 0; j < this.list_container.children[this.list_container.childElementCount - 1].childElementCount; j++) {
                this.list_container.children[this.list_container.childElementCount - 1].children[j].classList.toggle('is_hidden')
            }
            this.list_container.children[this.list_container.childElementCount - 1].classList.toggle('is_hidden')

            // 記憶したアプリをリセット
            this.selectapp = -1
        })

        // installボタンが押された時
        this.list_container.children[this.list_container.childElementCount - 1].children[5].addEventListener('click', () => {
            // アプリを入れれるかどうか
            let can = true
            let apppos
            // 自分がセキュリティソフトの時
            if (apps[this.selectapp].type == "security") {
                // 既にセキュリティソフトが入っていたら
                for (var k = 0; k < SystemConfigs.installed_software.length; k++) {
                    if (SystemConfigs.installed_software[k][2] == "security") {
                        // セキュリティソフトをこれ以上入れられないようにする
                        can = false
                        apppos = SystemConfigs.installed_software[k][0]
                    }
                }
            }

            if (can) {
                document.getElementById("install_btn").innerText = "アンインストール"

                //  Configのinstalled_softwareにアプリを追加
                SystemConfigs.installed_software.push([apps[this.selectapp].name, apps[this.selectapp].safety, apps[this.selectapp].type])

                //  評価
                // 安全なソフトをインストールしたら、
                if (apps[this.selectapp].safety == "safe") {
                    if (apps[this.selectapp].price) {
                        // 有料のものを導入
                        SystemConfigs.Result.SecurityScore += 400
                        //　アプリの値段を収入から引く
                        SystemConfigs.Result.Revenue -= apps[this.selectapp].price
                    }
                    else {
                        //　無料のものを導入
                        SystemConfigs.Result.SecurityScore += 200
                    }
                }
                else {  // 怪しいソフトをインストールしたら、
                    SystemConfigs.Result.SecurityScore -= 200
                }

                // インストール
                SystemConfigs.Packages.Install(apps[this.selectapp].name,"/images/apps/AntiVirus.png",()=>{CallWindow(VirusScanner, "Window_" + apps[this.selectapp].name)})
                RefreshDesktop()
            }
            else {
                if (apppos == apps[this.selectapp].name) {
                    document.getElementById("install_btn").innerText = "インストール"

                    //　保存されている配列の位置を検索
                    var loc = SystemConfigs.installed_software.indexOf([apps[this.selectapp].name, apps[this.selectapp].safety])
                    //　Configのinstalled_softwareからアプリを削除
                    SystemConfigs.installed_software.splice(loc, 1)

                    // デスクトップからアイコンを削除
                    SystemConfigs.Packages.Uninstall(apps[this.selectapp].name)
                    this.destroy()
                    RefreshDesktop()
                }
            }
        })

        // document.getElementById("gamestart_button").onclick = () => {this.game_button("start")};
        // this.bodyElem.firstElementChild.nextElementSibling.firstChild.addEventListener('click',() => {this.game_button("start")})
        // this.bodyElem.firstElementChild.nextElementSibling.lastElementChild.addEventListener('click',() => {this.game_button("stop")})
    }

    // リスト画面でアプリ名表示
    fix_app(text) {
        text = text.replaceAll("\n", " ")
        text = text.substr(0, 12)
        return text
    }
    fix_text(text) {
        return text
    }
    change_text(app) {
        document.getElementById("title2").innerText = app.name
        document.getElementById("corpname").innerText = app.corporation
        document.getElementById("introduction").innerText = app.introduction
        document.getElementById("author").innerText = app.corporation
        document.getElementById("function").innerText = app.func

        if (app.price == 0) {
            document.getElementById("price").innerText = "無料"
        }
        else {
            document.getElementById("price").innerText = "￥" + app.price
        }


        for (var i = 0; i < SystemConfigs.installed_software.length; i++) {
            if (SystemConfigs.installed_software[i][0] == apps[this.selectapp].name) {
                document.getElementById("install_btn").innerText = "アンインストール"
            }
            else {
                document.getElementById("install_btn").innerText = "インストール"
            }
        }
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}