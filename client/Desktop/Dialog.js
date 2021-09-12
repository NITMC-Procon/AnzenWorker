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

export class Dialog{
    constructor(html, title, parent, configs){
        /** @type {string} */
        this.html = html;
        /** @type {string} */
        this.title = title;
        this.parent = parent;
        this.configs = configs;
        this.window_id = "";

        let windowhtml = createElementFromHTML(`
        <div class="overlay">
            <div class="window" style="${(this.configs != null && this.configs.style) ? this.configs.style : ""}">
                <div class="window-titlebar">
                    <span>${this.title}</span>
                    ${(this.configs != null && !this.configs.no_xbutton) ? '<span class="Xbutton"></span>' : ''}
                </div>
                <div class="window-body">
                    ${this.html}
                </div>
            </div>
        </div>`)
        /** @type {any} */ //Element型にはinnerTextがなくてIntellisenseがエラー吐いてめんどい
        this.dialog = this.parent.windowarea.insertAdjacentElement('afterbegin', windowhtml)
        /** @type {HTMLElement} */
        this.drag = this.dialog.firstElementChild
        this.drag.style.position = "relative";
        for (const eventName of ['mouseup', 'mousedown', 'touchstart', 'touchmove', 'touchend', 'touchcancel']) {
            this.drag.addEventListener(eventName, e => e.stopPropagation(), { passive: true });
        }
        for (const eventName of ['mousedown', 'touchstart']) {
            this.drag.addEventListener(eventName, () => {//アロー関数にするとthisがインスタンスを示すようになる
                this.bringToTop()
            }, { passive: true });
        }
        
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
        
    }
    destroy(){
        if (this.parent.windows[this.window_id]){
            delete this.parent.windows[this.window_id]
        }
        this.dialog.remove()
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}
