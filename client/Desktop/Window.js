'use strict';

/* parent
{
    windowarea:document.getElementById("htmlwindows"),
    windowindex:0
}
*/
/*configs
{
    no_xbutton: true,
    style:""
}*/

// 例
// new func(`<div style="display: flex;align-items: center;justify-content: space-evenly;">
//              <input value="ゲーム開始" type="button" id="gamestart_button"></input>
//              <input value="ゲーム終了" type="button" id="gamestop_button"></input>
//              </div>`,
//     "title",window["parent"],{
//     no_xbutton: true
//   })

export class Window{
    constructor(html, title, parent, configs){
        /** @type {string} */
        this.html = html;
        /** @type {string} */
        this.title = title;
        this.parent = parent;
        this.configs = configs;
        this.window_id = "";

        let windowhtml = createElementFromHTML(`
            <div class="window" style="${(this.configs != null && this.configs.style) ? this.configs.style : ""}">
                <div class="window-titlebar">
                    <span>${this.title}</span>
                    ${(this.configs != null && !this.configs.no_xbutton) ? '<span class="Xbutton"></span>' : ''}
                </div>
                <div class="window-body">
                    ${this.html}
                </div>
            </div>`)
        /** @type {HTMLElement} */
        this.drag = this.parent.windowarea.insertAdjacentElement('afterbegin', windowhtml)
        this.drag.style.top = Math.random() * (document.documentElement.clientHeight / 2) + "px"
        this.drag.style.left = Math.random() * (document.documentElement.clientWidth / 2) + "px"
        this.drag.style["z-index"] = ++this.parent.windowindex;
        for (const eventName of ['mouseup', 'mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']) {
            this.drag.addEventListener(eventName, e => e.stopPropagation(), { passive: true });
        }
        for (const eventName of ['mousedown', 'touchstart']) {
            this.drag.addEventListener(eventName, () => {//アロー関数にするとthisがインスタンスを示すようになる
                this.bringToTop()
            }, { passive: true });
        }
        const mdown = (e) => {
            this.drag.classList.add("dragging");
            var event = e;
            //タッチデイベントとマウスのイベントの差異を吸収
            if (e.type !== "mousedown") {
                event = e.changedTouches[0];
            }
            //要素内の相対座標
            this.localx = event.pageX - this.drag.offsetLeft;
            this.localy = event.pageY - this.drag.offsetTop;
            //ムーブイベントにコールバック
            this.drag.firstElementChild.addEventListener("mousemove", mmove, false);
            this.drag.firstElementChild.addEventListener("touchmove", mmove, false);
    
            //マウスボタンが離されたとき、またはカーソルが外れたとき発火
            this.drag.addEventListener("mouseup", mup, { passive: true });
            this.drag.addEventListener("touchend", mup, { passive: true });
            document.body.addEventListener("mouseleave", mup, { passive: true });
            document.body.addEventListener("touchleave", mup, { passive: true });
        }
        //マウスカーソルが動いたときに発火
        const mmove = (e) => {
            var event = e;
            if (e.type !== "mousemove") {
                event = e.changedTouches[0];
            }
            //フリックしたときに画面を動かさないようにデフォルト動作を抑制
            e.preventDefault();
    
            this.drag.style.top = event.pageY - this.localy + "px";
            this.drag.style.left = event.pageX - this.localx + "px";
        }
        //マウスボタンが上がったら発火
        const mup = (e) => {
            //ムーブベントハンドラの消去
            this.drag.removeEventListener("mouseup", mup, false);
            this.drag.removeEventListener("touchend", mup, false);
            this.drag.firstElementChild.removeEventListener("mousemove", mmove, false);
            this.drag.firstElementChild.removeEventListener("touchmove", mmove, false);
            //クラス名 .drag も消す
            this.drag.classList.remove("dragging");
        }
    
        //ウィンドウバークリックで発火
        this.drag.firstElementChild.addEventListener("mousedown", mdown, { passive: true });
        this.drag.firstElementChild.addEventListener("touchstart", mdown, { passive: true });
        
        this.bodyElem = this.drag.lastElementChild
        this.titleElem = this.drag.firstElementChild.firstElementChild
        
        if(this.configs != null && !this.configs.no_xbutton){
            this.Xbutton = this.drag.firstElementChild.lastElementChild
            this.Xbutton.addEventListener('click', () => {
                this.destroy()
            })
            //閉じるボタンクリックではドラッグしないように…
            for (const eventName of ['mousedown', 'touchstart']) {
                this.Xbutton.addEventListener(eventName, (e) => {//アロー関数にするとthisがインスタンスを示すようになる
                    e.stopPropagation()
                });
            }
        }
    }
    reload(){
        this.bodyElem.innerHTML = this.html
        this.titleElem.textContent = this.title
    }
    bringToTop(){
        this.drag.style["z-index"] = ++this.parent.windowindex;
    }
    destroy(){
        if (this.parent.windows[this.window_id]){
            delete this.parent.windows[this.window_id]
        }
        this.drag.remove()
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}