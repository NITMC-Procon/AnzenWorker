'use strict'
import { Window,RandomData } from "../Window.js"
import { SystemConfigs, Task } from "../../System/System.js"
import { RefreshDesktop } from "../../System/Desktop.js"
import { VirusScanner } from "./VirusScanner.js"
import { PCcleaner } from "./PCcleaner.js"
import { RansomWare } from "../../Viruses/VirusEvents.js"
import { Notify } from "../../Functions/notify.js"
import { Feedback } from "./feedback.js"

const RandData = RandomData()

const html = `
<div style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;" ${RandData}>
    <div style="width: 100%;overflow:auto;">
        <diV class = "error">
            ネットワークに接続できませんでした。
        </div>
    </div>
</div>
<style>
    div[${RandData}] .title{
        font-size:2em;
        padding-top: 10px;
        padding-left: 30px;
    }
    div[${RandData}] .list_container{
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
    div[${RandData}] .store_container{
        display:flex;
        width:750px;
        height:250px;
        margin:3em 3.5em;
    }
    div[${RandData}] .is_hidden{
        display:none;
    }
    div[${RandData}] .store_background{
        width:750px;
        height:250px;
        box-sizing:border-box;
        background-color:#ffffff;
        border: 1px solid #cccccc;
        user-select: none;
    }
    div[${RandData}] .app_icon{
        position:relative;
        top:5px;
        left:17px;
    }
    div[${RandData}] .app_icon2{
        position:absolute;
        left:120px;
        top:100px;
    }
    div[${RandData}] .title2{
        position:absolute;
        font-size:2em;
        top:80px;
        left:325px;
    }
    div[${RandData}] .copname{
        position:absolute;
        font-size:1em;
        color: #0000FF;
        top:115px;
        left:325px;
        white-space: nowrap;
    }
    div[${RandData}] .introduction{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:150px;
        left:330px;
    }
    div[${RandData}] .install_btn{
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
    div[${RandData}] .price{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:220px;
        left:340px;
    }
    div[${RandData}] .detail{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:340px;
        left:400px;
    }
    div[${RandData}] .platform_subject{
        white-space: pre;
        position:absolute;
        font-size:1.6em;
        top:365px;
        left:100px;
    }
    div[${RandData}] .platform_text{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:410px;
        left:200px;
    }
    div[${RandData}] .author_subject{
        white-space: pre;
        position:absolute;
        font-size:1.6em;
        top:440px;
        left:100px;
    }
    div[${RandData}] .author_text{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        color: #0000FF;
        top:480px;
        left:100px;
    }
    div[${RandData}] .function_subject{
        white-space: pre;
        position:absolute;
        font-size:1.6em;
        top:365px;
        left:500px;
    }
    div[${RandData}] .function_text{
        white-space: pre;
        position:absolute;
        font-size:1.2em;
        top:400px;
        left:480px;
    }
    div[${RandData}] .backbtn{
        position:absolute;
        top:0px;
        left:0px;
        width: 57px;
        height: 50px;
        line-height: 50px;
        background-color: #808080;
        color: #fff;
    }
    div[${RandData}] .star_icon{
        position:relative;
        top:-20px;
        left:10px;
    }
    div[${RandData}] .star_icon2{
        position:absolute;
        top:190px;
        left:550px;
        font-size: 2em;
    }
    div[${RandData}] .star5_rating{
        position: relative;
        z-index: 0;
        display: inline-block;
        white-space: nowrap;
        color: #CCCCCC; /* グレーカラー 自由に設定化 */
        /*font-size: 25px;  フォントサイズ 自由に設定化 */
    }

    div[${RandData}] .star5_rating:before, .star5_rating:after{
        content: '★★★★★';
    }

    div[${RandData}] .star5_rating:after{
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        overflow: hidden;
        white-space: nowrap;
        color: #ffcf32; /* イエローカラー 自由に設定化 */
    }

    div[${RandData}] .star5_rating[data-rate="5"]:after{ width: 100%; } /* 星5 */
    div[${RandData}] .star5_rating[data-rate="4"]:after{ width: 80%; } /* 星4 */
    div[${RandData}] .star5_rating[data-rate="3"]:after{ width: 60%; } /* 星3 */
    div[${RandData}] .star5_rating[data-rate="2"]:after{ width: 40%; } /* 星2 */
    div[${RandData}] .star5_rating[data-rate="1"]:after{ width: 20%; } /* 星1 */
    div[${RandData}] .star5_rating[data-rate="0"]:after{ width: 0%; } /* 星0 */
</style>`
const style = "width:54em;height:34em;"

export let apps = [
    {
        name: "AntiVirus",
        star: 4,
        price: 0,
        introduction: "ウイルス対策ソフト\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    }, {
        name: "EasyVirusScanner",
        star: 1,
        price: 0,
        introduction: "Virusのすきゃんができる.\nすごく安心する.",
        func: "・Virusがみつかる.\n・コンピュータを防衛する",
        corporation: "不明",
        safety: "danger",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    }, {
        name: "AntiVirusPro",
        star: 3,
        price: 3900,
        introduction: "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    }, {
        name: "PC-Cleaner",
        star: 1,
        price: 0,
        introduction: "あなたのパソコンをお掃除します！\n不要なキャッシュを削除して動作を向上させます",
        func: "・キャッシュの削除\n・不要なファイルの削除",
        corporation: "不明",
        safety: "danger",
        type: "app",
        icon: "../images/apps/PC-Cleaner.png",
        window: PCcleaner,
        last_update: "2015/11/02",
    }, {
        name: "Feedback",
        star: 5,
        price: 0,
        introduction: `安全仕事人に対して、
        フィードバックを送信するアプリ\n`,
        func: "・気になる点がございましたら、\n気軽にご送信ください\n・いただいたメッセージには全て目を通し、\n改善に取り組みます",
        corporation: "©AnzenWorker",
        safety: "safe",
        type: "app",
        icon: "../images/apps/Feedback.png",
        window: Feedback,
        last_update: "2022/02/17",
    }, {
        name: "AntiVirusPro",
        star: 3,
        price: 3900,
        introduction: "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    }, {
        name: "AntiVirusPro",
        star: 3,
        price: 3900,
        introduction: "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    }, {
        name: "AntiVirusPro",
        star: 3,
        price: 3900,
        introduction: "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    }, {
        name: "AntiVirusPro",
        star: 3,
        price: 3900,
        introduction: "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    }, {
        name: "AntiVirusPro",
        star: 3,
        price: 3900,
        introduction: "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
        func: "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック",
        corporation: "©Anti Virus Corporation",
        safety: "safe",
        type: "security",
        icon: "../images/apps/AntiVirus.png",
        window: VirusScanner,
        last_update: "2015/11/02",
    },
]

export class Store extends Window {
    constructor() {
        super(html, "Store", { style: style });
        if (this.creationFailed) return

        /** @type {HTMLElement} *///@ts-ignore
        this.error = this.bodyElem.firstElementChild.firstElementChild.firstElementChild
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
                    <img src = ${app.icon} width="110px" height="110px">
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
                    <img src = '../images/apps/AntiVirus.png' id = "icon2" width="140px" height="140px">
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
        // for (let j = 0; j < this.list_container.children[this.list_container.childElementCount - 1].childElementCount; j++) {
        //     this.list_container.children[this.list_container.childElementCount - 1].children[j].classList.toggle('is_hidden')
        // }
        this.list_container.children[this.list_container.childElementCount - 1].classList.add('is_hidden')
        this.error.classList.add('is_hidden')
        this.can = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // 情報を引き継ぐ
        if (SystemConfigs.installed_software.length != 0) {
            this.can = SystemConfigs.installed_software;
        }

        /*
        if (SystemConfigs.connected_wifi.length == 0) {
            for (let j = 0; j < this.list_container.childElementCount; j++) {
                this.list_container.children[j].classList.toggle('is_hidden')
            }
        }
        */
        for (let i = 2; i < this.list_container.childElementCount - 1; i++) {
            this.list_container.children[i].addEventListener('click', () => {
                // 表示するオブジェクトを入れ替える
                for (let j = 0; j < this.list_container.childElementCount; j++) {
                    this.list_container.children[j].classList.add('is_hidden')
                }
                // for (let j = 0; j < this.list_container.children[this.list_container.childElementCount - 1].childElementCount; j++) {
                //     this.list_container.children[this.list_container.childElementCount - 1].children[j].classList.toggle('is_hidden')
                // }
                this.list_container.children[this.list_container.childElementCount - 1].classList.remove('is_hidden')
                // this.error.classList.toggle('is_hidden')

                // 選んだアプリを記憶
                this.selectapp = i - 2

                // テキスト変更
                this.change_text(apps[i - 2])

                // アプリを入れれるかどうか
                if (this.can[this.selectapp] == 1) {
                    document.getElementById("install_btn").innerText = "アンインストール"
                }
                else {
                    document.getElementById("install_btn").innerText = "インストール"
                }
            })
        }
        // backボタンが押された時
        this.list_container.children[this.list_container.childElementCount - 1].children[this.list_container.children[this.list_container.childElementCount - 1].childElementCount - 1].addEventListener('click', () => {
            // 表示するオブジェクトを入れ替える
            for (let j = 0; j < this.list_container.childElementCount; j++) {
                this.list_container.children[j].classList.remove('is_hidden')
            }
            // for (let j = 0; j < this.list_container.children[this.list_container.childElementCount - 1].childElementCount; j++) {
            //     this.list_container.children[this.list_container.childElementCount - 1].children[j].classList.toggle('is_hidden')
            // }
            this.list_container.children[this.list_container.childElementCount - 1].classList.add('is_hidden')
            this.error.classList.add('is_hidden')

            // 記憶したアプリをリセット
            this.selectapp = -1
        })

        // installボタンが押された時
        this.list_container.children[this.list_container.childElementCount - 1].children[5].addEventListener('click', () => {
            if (this.can[this.selectapp] == 0) {
                document.getElementById("install_btn").innerText = "アンインストール"
                this.can[this.selectapp] = 1;

                //  Configのinstalled_softwareにアプリを追加
                SystemConfigs.installed_software = this.can

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
                    Task.Complete("Store", true);//失敗

                    for (var j = 0; j < SystemConfigs.installed_software.length; j++) {
                        if (SystemConfigs.installed_software[j][0] == apps[0].name || SystemConfigs.installed_software[j][0] == apps[2].name) {
                            // wifi切断
                            SystemConfigs.connected_wifi.length = 0;
                            Notify("ウイルスを検出したため、Wi-Fiを切断しました")
                        }
                    }

                }
                // インストール
                let sa = this.selectapp
                SystemConfigs.Packages.Install(apps[sa].name, apps[sa].icon, apps[sa].window)
                RefreshDesktop()
            }
            else {
                document.getElementById("install_btn").innerText = "インストール"
                this.can[this.selectapp] = 0;

                //　Configのinstalled_softwareからアプリを削除
                SystemConfigs.installed_software = this.can

                // デスクトップからアイコンを削除
                SystemConfigs.Packages.Uninstall(apps[this.selectapp].name)
                //this.destroy()
                RefreshDesktop()
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

        document.getElementById("icon2").setAttribute('src', app.icon);

        if (app.price == 0) {
            document.getElementById("price").innerText = "無料"
        }
        else {
            document.getElementById("price").innerText = "￥" + app.price
        }

        // アプリを入れれるかどうか
        if (this.can[this.selectapp] == 1) {
            document.getElementById("install_btn").innerText = "アンインストール"
        }
        else {
            document.getElementById("install_btn").innerText = "インストール"
        }
    }
}