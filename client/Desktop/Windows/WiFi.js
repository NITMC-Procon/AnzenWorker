'use strict'
import { Window } from "../Window.js"
import { configs } from "../Desktop.js"

const html = `
<div style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;">
    <div style="width: 100%;">
    </div>
    <div style="width: 100%;box-sizing:border-box;height:3em;line-height: 3em;display: flex;justify-content: space-between;align-items: center;padding: 0 2em">
        <h1 style="margin:0"></h1>
        <input type="button" value="接続" style="height:2em;">
    </div>
</div>
<style>
    .wifi_container{
        display: flex;
        margin:0.2em 0.5em ;
        box-sizing: border-box;
        background-color: #c0c0c0;
        padding: 2px;
        user-select: none;
        align-items: center;
    }
    .wicon{
        position: relative;
        width: 2em;
        height: 2em;
    }
    .wicon>span{
        position: absolute;
        bottom: 0;
        width: 33%;
        height:1em;
        border-style: solid;
        border-color: black;
        border-width: 1px;
        box-sizing: border-box;
        border-radius: 1px; /* 棒の四隅の丸み*/
    }
    .wicon[value="1"]>span:nth-child(1){
        background: #4169e1;
    }
    .wicon[value="2"]>span:nth-child(-n+2){
        background: #4169e1;
    }
    .wicon[value="3"]>span{
        background: #4169e1;
    }
    .wicon>span:nth-child(1){
        left:0%;
        height:33%;
    }
    .wicon>span:nth-child(2){
        left:33%;
        height:66%;
    }
    .wicon>span:nth-child(3){
        left:66%;
        height:99%;
    }
</style>`
const style="width:20em;height:20em;"

export class WiFi extends Window{
    constructor(parent){
        super(html,"WiFi",parent,{style:style});
        this.wifi_list = this.get_wifis()
        this.wifi_container = this.bodyElem.firstElementChild.firstElementChild
        let allwifi = ''
        
        this.wifi_list.forEach((wifi) =>{
            let container = `<div class="wifi_container">
                    <div class="wicon" value="${wifi[3]}">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <h2 style="margin:0 0.5em;">${wifi[0]}</h2>
                    <div style="margin:0 0.5em 0 auto;text-align:right;">
                        <p style="margin:0;">${wifi[1]}</p>
                        <p style="margin:0;font-size:0.5em;">${wifi[2]?"暗号化されています":"暗号化されていません"}</p>
                    </div>
                </div>`
            allwifi += container
        })
        this.wifi_container.insertAdjacentHTML('beforeend',allwifi)

        for(let i = 0; i<this.wifi_container.childElementCount; i++){
            this.wifi_container.children[i].addEventListener('click',()=>{
                this.select(this.wifi_list[i])
            })
        }
        this.connecttxt = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
        /**@type {any} */
        this.connectbtn = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.lastElementChild
        this.connectbtn.addEventListener('click',()=>{
            this.connect()
        })


        // document.getElementById("gamestart_button").onclick = () => {this.game_button("start")};
        // this.bodyElem.firstElementChild.nextElementSibling.firstChild.addEventListener('click',() => {this.game_button("start")})
        // this.bodyElem.firstElementChild.nextElementSibling.lastElementChild.addEventListener('click',() => {this.game_button("stop")})
    }
    get_wifis() {//Wi-Fi一覧取得(実際はネットから持ってくるか、自動生成でそれっぽいの用意する)
        // 接続先, 暗号化, 保護されているか(0:保護なし/1:保護あり), WiFiの強さ（0~3）
        let wifis = [
            ["Anzenworker", "802.1x", 1, 3],
            ["FREE_INTE", "open", 0, 3],
            ["Anzenwork2", "WPA2-PSK", 1, 2]
        ]
        return wifis
    }
    show_wifi(wifi) {
        this.connecttxt.textContent = wifi[0]
    }
    fix_wifi(text) {
        text = text.replaceAll("\n", " ")
        text = text.substr(0, 15)
        return text
    }
    select(wifi){
        this.show_wifi(wifi)
        this.keep = wifi
        if (wifi == configs.connected_wifi) {
            this.connectbtn.value = "切断"
        }
        else {
            this.connectbtn.value = "接続"
        }
    }
    connect(){
        if(!this.keep) return;
        if (configs.connected_wifi == this.keep) {
            // ボタンの文字を「接続」にする
            this.connectbtn.value = "接続"
            // 接続先をリセット
            configs.connected_wifi = []
        }else {  // Wifiに接続されていない時（「接続」を押したとき）
            // ボタンの文字を「切断」にする
            this.connectbtn.value = "切断"
            // 接続先のWifiを記憶する
            configs.connected_wifi = this.keep

            // まだクリアしてなかったら
            if(!configs.Task_IsCompleted("Wi-Fi")){
                let current_wifi = this.keep

                // this.time.delayedCallだとウィンドウ閉じたら消える
                setTimeout(() => {
                    // 5秒後に繋がりっぱなしだったら
                    if (configs.connected_wifi == current_wifi) {
                        // 接続先の暗号強度によってスコアを変える
                        let score=50
                        switch(current_wifi[1]){
                            case "802.1x":score=150;break;
                            case "open":score=50;break;
                            case "WPA2-PSK":score=100;break;
                        }
                        //　結果を送信
                        configs.EmitResult({
                            type: "task",
                            status: "success",
                            task: {
                                id: 2,
                                "point": score
                            }
                        })
                        configs.Task_Complete("Wi-Fi")
                    }
                }, 5000);
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