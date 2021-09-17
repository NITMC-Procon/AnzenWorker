'use strict';

/** 
 * @typedef  {Object} Config - ウィンドウ用コンフィグ
 * @property {!String=} style - ウィンドウエレメントに適用されるスタイル
 * @property {!Boolean=} no_xbutton - ウィンドウの閉じるボタンの非表示
 * @property {!Boolean=} no_resizable
 */

/**
 * @typedef  {Object} Parent - 親要素指定用コンフィグ
 * @property {HTMLElement} windowarea - 親要素のHTMLElement
 * @property {Number} windowindex - ウィンドウのインデックス
 * @property {Array<Window>} windows - ウィンドウのリスト
 */

export class Window{
    /**
     * @param {String} html - HTML文字列
     * @param {String} title - タイトル文字列
     * @param {Parent} parent - 親要素指定用コンフィグ
     * @param {Config} configs - ウィンドウ用コンフィグ
     */
    constructor(html, title, parent, configs){
        /** @type {string} */
        this.html = html;
        /** @type {string} */
        this.title = title;
        /** @type {Parent} */
        this.parent = parent;
        /** @type {Config} */
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
                ${(this.configs != null && !this.configs.no_resizable) ?`
                <div>
                    <div style="position: absolute; top: -5px; cursor: ns-resize; width: 100%; height: 10px;"></div>
                    <div style="position: absolute; left: -5px; top: 0px; cursor: ew-resize; width: 10px; height: 100%;"></div>
                    <div style="position: absolute; bottom: -5px; cursor: ns-resize; width: 100%; height: 10px;"></div>
                    <div style="position: absolute; right: -5px; top: 0px; cursor: ew-resize; width: 10px; height: 100%;"></div>
                    <div style="position: absolute; top: -5px; left: -5px; cursor: nwse-resize; width: 10px; height: 10px;"></div>
                    <div style="position: absolute; left: -5px; bottom: -5px; cursor: nesw-resize; width: 10px; height: 10px;"></div>
                    <div style="position: absolute; right: -5px; bottom: -5px; cursor: nwse-resize; width: 10px; height: 10px;"></div>
                    <div style="position: absolute; top: -5px; right: -5px; cursor: nesw-resize; width: 10px; height: 10px;"></div>
                </div>`:""}
            </div>`)
        /** @type {HTMLElement} *///@ts-ignore
        this.drag = this.parent.windowarea.insertAdjacentElement('afterbegin', windowhtml)
        if(!this.drag.style["min-width"]) this.drag.style["min-width"]= this.title.length + 2 + "em";
        if(!this.drag.style["min-height"]) this.drag.style["min-height"]= "2em";
        
        this.drag.style.top = Math.random() * (document.documentElement.clientHeight / 2) + "px"
        this.drag.style.left = Math.random() * (document.documentElement.clientWidth / 2) + "px"
        this.drag.style["z-index"] = ++this.parent.windowindex;
        for (const eventName of ['mouseup', 'mousedown', 'touchstart', 'touchend']) {
            this.drag.addEventListener(eventName, e => e.stopPropagation(), { passive: true });
        }
        
        this.titleElem = this.drag.firstElementChild.firstElementChild
        this.bodyElem = this.drag.firstElementChild.nextElementSibling
        
        this.makeDraggable()
        this.makeResizable()
    }
    makeDraggable(){
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
            document.body.addEventListener("mousemove", mmove, { passive: false });
            document.body.addEventListener("touchmove", mmove, { passive: false });
    
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
            document.body.removeEventListener("mousemove", mmove, false);
            document.body.removeEventListener("touchmove", mmove, false);
            this.drag.removeEventListener("mouseup", mup, false);
            this.drag.removeEventListener("touchend", mup, false);
            document.body.removeEventListener("mouseleave", mup, false);
            document.body.removeEventListener("touchleave", mup, false);
            //クラス名 .drag も消す
            this.drag.classList.remove("dragging");
        }
    
        //ウィンドウバークリックで発火
        this.drag.firstElementChild.addEventListener("mousedown", mdown, { passive: true });
        this.drag.firstElementChild.addEventListener("touchstart", mdown, { passive: true });

        if(this.configs != null && !this.configs.no_xbutton){
            this.Xbutton = this.drag.firstElementChild.lastElementChild
            this.Xbutton.addEventListener('click', () => {
                this.destroy()
            })
            //閉じるボタンクリックではドラッグしないように…
            for (const eventName of ['mousedown', 'touchstart']) {
                this.Xbutton.addEventListener(eventName, (e) => {//アロー関数にするとthisがインスタンスを示すようになる
                    e.stopPropagation()
                },{passive:true});
            }
        }
    }
    makeResizable(){
        Array.from(this.drag.lastElementChild.children).forEach(
        /** @param {HTMLElement} child */
        (child, i) => {
            let top = i == 0 || i == 4 || i == 7 ? true : false;
            let left = i == 1 || i == 4 || i == 5 ? true : false;
            let bottom = i == 2 || i == 5 || i == 6 ? true : false;
            let right = i == 3 || i == 6 || i == 7 ? true : false;

            // いちいち計算してたらもったいないので初めからdivで指定してある。下のコメントアウトを外すと同じdivが出来上がる。
            // child.style.position = "absolute";
            // if (top) child.style.top = "-5px";
            // if (left) child.style.left = "-5px";
            // if (right) child.style.right = "-5px";
            // if (bottom) child.style.bottom = "-5px";
            // if (!(top || bottom)) { // 左右バー
            //     child.style.bottom = ""
            //     child.style.top = "0px";
            //     child.style.cursor = "ew-resize";
            // } else {
            //     child.style.cursor = "ns-resize";
            // }
            // if (!left && !right) {
            //     child.style.width = "100%"
            // } else {
            //     child.style.width = "10px"
            // }
            // if (!top && !bottom) {
            //     child.style.height = "100%"
            // } else {
            //     child.style.height = "10px"
            // }
            // if ((top && left) || (right && bottom)) child.style.cursor = "nwse-resize";
            // if ((top && right) || (left && bottom)) child.style.cursor = "nesw-resize";

            child.addEventListener('mousedown',(e)=>{
                e.stopPropagation()
                /** @type {any} */
                let event = e
                if (e.type !== "mousedown") {
                    //@ts-ignore
                    event = e.changedTouches[0];
                }
                this.localx = event.pageX - this.drag.offsetLeft;
                this.localy = event.pageY - this.drag.offsetTop;
                let position = this.bodyElem.getBoundingClientRect()

                const move = (e) => {
                    let event = e;
                    if (e.type !== "mousemove") {
                        event = e.changedTouches[0];
                    }
                    //フリックしたときに画面を動かさないようにデフォルト動作を抑制
                    e.preventDefault();
                    if (bottom) this.drag.style.height = event.pageY - position.top + this.titleElem.clientHeight + "px";
                    if (right) this.drag.style.width = event.pageX - position.left + "px";
                    if (top){
                        this.drag.style.top = event.pageY - this.localy + "px";
                        this.drag.style.height = position.top + position.height - event.pageY + this.localy + "px";
                    }
                    if (left){
                        this.drag.style.left = event.pageX - this.localx + "px";
                        this.drag.style.width = position.left + position.width - event.pageX + this.localx + "px";
                    }
                }
                const up = (e) => {
                    document.body.removeEventListener("mousemove", move, false);
                    document.body.removeEventListener("touchmove", move, false);
                    this.drag.lastElementChild.firstElementChild.removeEventListener("mouseup", up, false);
                    this.drag.lastElementChild.firstElementChild.removeEventListener("touchend", up, false);
                    document.body.removeEventListener("mouseleave", up, false);
                    document.body.removeEventListener("touchleave", up, false);
                }
                document.body.addEventListener("mousemove", move, { passive: false });
                document.body.addEventListener("touchmove", move, { passive: false });
        
                //マウスボタンが離されたとき、またはカーソルが外れたとき発火
                this.drag.addEventListener("mouseup", up, { passive: true });
                this.drag.addEventListener("touchend", up, { passive: true });
                document.body.addEventListener("mouseleave", up, { passive: true });
                document.body.addEventListener("touchleave", up, { passive: true });
            })
        })
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

export function RandomData(){
    return "data-" + Math.random().toString(32).substring(2)
}