'use strict'
import { AdVirusService1 } from "../../Services/Service/AdVirusService1.js";
import { SystemConfigs } from "../../System/System.js";
import { Window } from "../Window.js"
import { Installer } from "./Installer.js";

const html = `
<div id="browserframe" style="display: flex;flex-direction: column;height: 100%;">
<div style="width: 100%;background-color: whitesmoke;flex-shrink:0;margin: 1vh 0;">
    <div style="display: flex;">
        <textarea id="urlarea" style="width: 87%;height: 1.2em;font-size: 1rem;resize: none;margin-left: 1%"></textarea>
        <button id="go" style="width: 8%;margin-left: 1%">Go</button>
    </div>
</div>
<div id="contentFrame" style="overflow-y: auto;display:flex;flex-direction:column;flex-grow: 1;">
</div>
<div id="downloadFrame" style="background-color: whitesmoke;max-height:4em; display:flex;flex-shrink:0">
</div>
</div>
<style>
div.download::before{
    content: "⬇️";
}
div.download{
    width: 12rem;
    height: 4em;
    font-size: 1.2rem;
    text-align: center;
    line-height: 4em;
    vertical-align: middle;
    color: black;
    background-color: lightpink;
    border-radius: 10px;
}
</style>
`
const style="width:40em;height:30em;"

export class Browser extends Window {
    constructor(address) {
        super(html, "Browser", { style: style });
        if (this.creationFailed) return

        // @ts-ignore
        document.getElementById('urlarea').value = address;
        document.getElementById('go').onclick = onClickGo;
        navigate(address);
    }
}

function onClickGo() {
    // @ts-ignore
    navigate(document.getElementById('urlarea').value);
}

function navigate(address) {      
    switch (address) {
        case 'http://www.web-research.omg/':
            phishing1();
            break;
        case 'http://xxxfreeporn.omg/':
            porn1();
            break;
        default:
            notfound();
            break;
    }
}

function createdownload(file) {
    let ddown = document.createElement('div');
    ddown.setAttribute('class','download');
    let tx = document.createTextNode(file.Name);
    ddown.appendChild(tx);
    ddown.addEventListener('click',file.Clickfunc);
    document.getElementById('downloadFrame').appendChild(ddown);
}

function notfound() {
    let ihtml = `<h1>404 not found.</h1>`;
    document.getElementById('contentFrame').innerHTML = ihtml;
}

function phishing1() {
    let ihtml = `
    <div id="mainframe1" style="background-color: steelblue;color: white;height: 100%;">
    <h1>ウェブリサーチサーベイ</h1>
    <h2>おめでとうございます</h2>
    <p>あなたは今期<span id="sdate"></span>の特別カスタマーに認定されました！簡単な質問に答えて最新Samsung Galaxyデバイスを獲得する！</p>
    <p>気をつけて！あなたは限られた時間を持つ: <span id="scountdown"></span></p>
    <div style="text-align: center;">
        <button id="banswer" style="font-size: 1.5rem;color: red;background-color: yellow;">今すぐサーベイに回答する</button>
    </div>
    <div style="height: 20px;"></div>
</div>
<div id="mainframe2" style="background-color: steelblue;color: white; display: none;height: 100%;">
    <p>簡単な質問に回答する！</p>
    <div style="border: solid 0.1px gray; border-radius: 5px;background-color: white;color: black;">
        <h2>質問1</h2>
        <p>あなたは毎日どの程度インターネットを使用するか</p>
        <div>
            <input type="radio" name="q1" value="a">1時間未満
            <input type="radio" name="q1" value="b">1～3時間
            <input type="radio" name="q1" value="c">4～6時間
            <input type="radio" name="q1" value="d">6時間以上
        </div>
    </div>
    <div style="height: 20px;"></div>
    <div style="border: solid 0.1px gray; border-radius: 5px;background-color: white;color: black;">
        <h2>質問2</h2>
        <p>あなたがメインで使用するデバイスは？</p>
        <div>
            <input type="radio" name="q2" value="a">Android携帯電話
            <input type="radio" name="q2" value="b">Apple携帯電話
            <input type="radio" name="q2" value="c">Windowsコンピュータ
            <input type="radio" name="q2" value="d">Appleコンピュータ
        </div>
    </div>
    <div style="height: 20px;"></div>
    <div style="border: solid 0.1px gray; border-radius: 5px;background-color: white;color: black;">
        <h2>質問3</h2>
        <p>あなたの希望するデバイスは？</p>
        <div>
            <input type="radio" name="q3" value="a">Samsung Galaxy S21 Ultra 5G<span style="color: red;">(残り1個)</span>
            <input type="radio" name="q3" value="b" disabled="true">Apple iPhone 13(在庫切れ)
            <input type="radio" name="q3" value="b" disabled="true">Apple iPhone 13 MAX(在庫切れ)

        </div>
    </div>
    <div style="height: 20px;"></div>
    <div style="text-align: center;">
        <button id="banswer2" style="font-size: 1.5rem;color: red;background-color: yellow;">送信する</button>
    </div>
    <div style="height: 20px;"></div>
</div>

<div id="mainframe3" style="background-color: steelblue;color: white; display: none;height: 100%;">
    <h2>最期のステップです！</h2>
    続行する為に登録プログラムをインストールしてください
    <div style="text-align: center;">
        <button id="banswer3" style="font-size: 1.5rem;color: red;background-color: yellow;">今すぐ登録して獲得</button>
    </div>
    <div style="height: 20px;"></div>
</div>
    `;
    document.getElementById('contentFrame').innerHTML = ihtml;

    document.getElementById('banswer').onclick = snext1;
    document.getElementById('banswer2').onclick = snext2;
    document.getElementById('banswer3').onclick = final;


    document.getElementById('sdate').textContent = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let spanCountDown = document.getElementById('scountdown');
    let countdown = new Date();
    countdown.setDate(countdown.getDate() + 1);
    setInterval(stepCountDown, 1000);
    function stepCountDown() {
        // @ts-ignore
        let current = new Date(countdown - new Date());
        spanCountDown.textContent = current.getDate() + "日" + current.getHours() + "時間" + current.getMinutes() + "分" + current.getSeconds() + "秒";
    }

    function snext1() {
        document.getElementById('mainframe1').style.display = "none";
        document.getElementById('mainframe2').style.display = "";
    }

    function snext2() {
        document.getElementById('mainframe2').style.display = "none";
        document.getElementById('mainframe3').style.display = "";
    }

    function final(){
        createdownload({ Name: "install.exe", Clickfunc: () => { new Installer() } })
        if(!SystemConfigs.Result.Flag.includes("phishing"))SystemConfigs.Result.Flag.push("phishing");
    }
}

function porn1() {
    let ihtml = `<div style="width: 100%;background-color: black;color: pink;">
    <h1>過激無料動画</h1>
    <img src="/images/virus/mosaic_sample.png" width="100%">
    <h2>※お楽しみいただくには専用プレイヤーをダウンロードしてください</h2>
    <div style="text-align: center;">
        <button id="dlplayer" style="width: 15rem;height: 4rem;font-size: 1.5rem;color: red;background-color: pink;">今すぐダウンロード</button>
    </div>
    </div>`;
    document.getElementById('contentFrame').innerHTML = ihtml;

    document.getElementById('dlplayer').onclick = onClickDownload;
    function onClickDownload() {
        createdownload({ Name: "player.exe", Clickfunc: () => { new AdVirusService1() } })
    }
    
}