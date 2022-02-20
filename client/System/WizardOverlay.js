let ovHtml = `
<style>
#tutorial {
    width: 100%;
    height: 100%;
    margin: 0px;
}

.overlay {
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.411);
}

#guide_desktop {
    width: 100%;
    height: 90%;
    display: flex;
    background-color: rgba(255, 251, 0, 0.384);
    position: absolute;
    left: 0px;
    top: 0px;
}

#guide_taskbar {
    width: 100%;
    height: 5vh;
    margin-left: 5vh;
    margin-top: 90vh;
    display: flex;
    background-color: rgba(255, 251, 0, 0.384);
    position: absolute;
    left: 0px;
    bottom: 0px;
}

#guide_start {
    width: 5vh;
    height: 5vh;
    margin-top: 90vh;
    display: flex;
    background-color: rgba(255, 251, 0, 0.384);
    position: absolute;
    left: 0px;
    bottom: 0px;
}

#guide_message{
    width: 40%;
    height: 40%;
    display: flex;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin: auto;
    padding: 20px;
    background-color: rgb(112, 184, 243);
    position: absolute;
    color: black;
}   
</style>

<div class="overlay">
<div id="guide_desktop"></div>
<div id="guide_taskbar"></div>
<div id="guide_start"></div>
<div id="guide_message">
    <div style="display: block;width: 100%">
    <div id="messagebox" style="width: 100%;height: 90%;font-size: 1.1rem;"></div>
    <div id="control" style="width: 100%;height: 2rem;text-align: right;">
        <button id="nextguide" style="width: 5rem;height: 2rem;">次へ</button>
    </div>
</div>
</div>
</div>
`;

export function WizardOverlay() {
    let ocontainer = document.getElementById('tutorial');
    ocontainer.innerHTML = ovHtml;

    let dguide_message = document.getElementById('guide_message');
    let dguide_desktop = document.getElementById('guide_desktop');
    let dguide_start = document.getElementById('guide_start');
    let dguide_taskbar = document.getElementById('guide_taskbar');

    let dmessagebox = document.getElementById('messagebox');
    let bnext = document.getElementById('nextguide');

    let pagecount = 0;

    bnext.onclick = function () {
        pageView(++pagecount);
    }

    pageView(pagecount);


    function pageView(count) {
        switch (count) {
            case 0:
                dguide_desktop.style.display = "none";
                dguide_start.style.display = "none";
                dguide_taskbar.style.display = "none";
                dmessagebox.innerHTML = "チュートリアルへようこそ。<br> \
                                            ここでは安全仕事人で使用する仮想デスクトップのかんたんな説明を行います。";
                break;
            case 1:
                dguide_desktop.style.display = "";
                dmessagebox.innerHTML = "ここはデスクトップです。<br> \
                                            アイコンをクリックすることでパソコンと同じようにアプリを開いたりできます。";
                break;
            case 2:
                dguide_desktop.style.display = "none";
                dguide_taskbar.style.display = "";
                dmessagebox.innerHTML = "ここはタスクバーです。<br> \
                                            開いているアプリが一覧で表示されます。非表示にしたアプリをここから開く事ができます。<br> \
                                            Wi-Fiアイコン等をクリックすることで設定を開く事も可能です。";
                break;
            case 3:
                dguide_taskbar.style.display = "none";
                dguide_start.style.display = "";
                dmessagebox.innerHTML = `ここはスタートメニューです。<br>
                                            アプリを起動したり、設定を開いたりすることができます。<br>
                                            <img src="/images/tutorial/menu.png" height="60%">`;
                break;
            case 4:
                dguide_start.style.display = "none";
                dmessagebox.innerHTML = `
                アプリ等を開くと図のようなウィンドウが開きます。パソコン同様にバーを持って移動したり閉じたりすることができます。<br>
                <img src="/images/tutorial/minimize.png">：最小化<br>
                <img src="/images/tutorial/maximize.png">：最大化<br>
                <img src="/images/tutorial/close.png">：閉じる(終了)<br>
                <img src="/images/tutorial/app.png" height="50%">
                `;
                break;
            case 5:
                dmessagebox.innerHTML = `以上です。次へをクリックすると終了します。`;
                break;
            case 6:
                document.getElementsByClassName('overlay')[0].remove();
                break;
            default:
                dguide_desktop.style.display = "none";
                dguide_start.style.display = "none";
                dguide_taskbar.style.display = "none";
                dmessagebox.innerHTML = "";
                break;
        }
    }

}