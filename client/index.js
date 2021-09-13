import { Desktop } from './scene/Desktop.js';

//ゲームの基本設定
var config = {
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.RESIZE,//リサイズされても最大まで描画
        parent: 'game',
    },
    scene: [
        Desktop
    ],
    antialias: false
};


//ロードされたらゲーム開始
window.addEventListener("load", () => {
    var game = new Phaser.Game(config);
    
    let overlays = Array.from( document.getElementsByClassName('overlay') ) ;
    overlays.forEach(element => {
        for (const eventName of ['mouseup','mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']){
            element.addEventListener(eventName, e => e.stopPropagation(),{passive: true});
        }
    });

    Array.from( document.getElementsByClassName('Xbutton') ).forEach(elem => {
        elem.addEventListener('click',()=>{
            elem.parentElement.parentElement.parentElement.classList.add("disabled")
        })
    })
});

// 構文
// notify(text message,[option])

// 例
// notify("message",{
//     callback: (args)=>{alert(args)},
//     args:["test"],
//     style: "background-color: white; color: red;"
//   })
window["notify"] = (text,option) =>{
    const notifyarea = document.getElementById("notification_area")
    let style=""
    if(option && option.style) style=option.style
    let notifytext = createElementFromHTML(`<div class="notification" style="${style}"><p>${text}</p></div>`)

    let notifyelem = notifyarea.insertAdjacentElement('afterbegin',notifytext)
    const clickfunc = () =>{
        notifyelem.classList.remove("show")
        setTimeout(()=>{
            notifyelem.remove()
        },600)
        if(option && typeof option.callback == 'function') option.callback(...option.args);
    }
    setTimeout(()=>{
        notifyelem.classList.add("show")
    },100)
    setTimeout(clickfunc,8000)

    notifyelem.addEventListener('click',clickfunc)
    
    //クリック透過無効化
    for (const eventName of ['mouseup','mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']){
        notifyelem.addEventListener(eventName, e => e.stopPropagation(),{passive: true});
    }
    return notifyelem
}

function createElementFromHTML(html){
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}
