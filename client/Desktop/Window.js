'use strict';

/** 
 * @typedef  {Object} Config - ウィンドウ用コンフィグ
 * @property {!String=} style - ウィンドウエレメントに適用されるスタイル
 * @property {!Boolean=} no_xbutton - ウィンドウの閉じるボタンの非表示
 * @property {!Boolean=} no_resizable - ウィンドウのりサイズの無効化
 * @property {!Boolean=} no_xbutton - ウィンドウの閉じるボタンの非表示
 * @property {!Boolean=} no_fullscrbutton - ウィンドウのフルスクリーンボタンの非表示
 * @property {!Boolean=} no_minimizebutton - ウィンドウの最小化ボタンの非表示
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
            <div class="window active" style="${(this.configs != null && this.configs.style) ? this.configs.style : ""}">
                <div class="window-titlebar">
                    <span>${this.title}</span>
                    <div style="display: flex;">
                      ${(this.configs != null && !this.configs.no_minimizebutton) ? '<span class="button minimize"></span>' : ''}
                      ${(this.configs != null && !this.configs.no_fullscrbutton) ? '<span class="button fullscr"></span>' : ''}
                      ${(this.configs != null && !this.configs.no_xbutton) ? '<span class="button close"></span>' : ''}
                    </div>
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
        this.window = this.parent.windowarea.insertAdjacentElement('afterbegin', windowhtml)
        if(!this.window.style["min-width"]) this.window.style["min-width"]= this.title.length + 2 + "em";
        if(!this.window.style["min-height"]) this.window.style["min-height"]= "2em";
        
        this.window.style.top = Math.random() * (document.documentElement.clientHeight / 2) + "px"
        this.window.style.left = Math.random() * (document.documentElement.clientWidth / 2) + "px"
        this.window.style["z-index"] = ++this.parent.windowindex;
        
        this.titleElem = this.window.firstElementChild.firstElementChild
        this.bodyElem = this.window.firstElementChild.nextElementSibling

        let btns = this.window.firstElementChild.lastElementChild
        this.buttons = {
            xbutton:(this.configs != null && !this.configs.no_xbutton)?btns.querySelector(".button.close"):null,
            fullscrbutton:(this.configs != null && !this.configs.no_fullscrbutton)?btns.querySelector(".button.fullscr"):null,
            minimizebutton:(this.configs != null && !this.configs.no_minimizebutton)?btns.querySelector(".button.minimize"):null,
        }
        if(this.buttons.xbutton){
            this.buttons.xbutton.addEventListener('click', () => {
                this.destroy()
            },{passive:true});
            for (const eventName of ['mousedown', 'touchstart']) {
                this.buttons.xbutton.addEventListener(eventName, (e) => {//アロー関数にするとthisがインスタンスを示すようになる
                    e.stopPropagation()
                },{passive:true});
            }
        }
        if(this.buttons.fullscrbutton){
            for (const eventName of ['mousedown', 'touchstart']) {
                this.buttons.fullscrbutton.addEventListener(eventName, (e) => {//アロー関数にするとthisがインスタンスを示すようになる
                    e.stopPropagation()
                },{passive:true});
            }
        }
        if(this.buttons.minimizebutton){
            for (const eventName of ['mousedown', 'touchstart']) {
                this.buttons.minimizebutton.addEventListener(eventName, (e) => {//アロー関数にするとthisがインスタンスを示すようになる
                    e.stopPropagation()
                },{passive:true});
            }
        }

        //ウィンドウ以外をクリックしたら非アクティブ化
        const desktop = document.getElementById("desktop")
        const selectother = (e) => {
            if (e.target.closest('.active') !== this.window) {
                this.window.classList.remove("active");
                desktop.removeEventListener('mousedown', selectother)
            }
        }
        this.window.addEventListener('mousedown', (e) => {
            if (!this.window.classList.contains("active")) desktop.addEventListener('mousedown', selectother)
            this.window.classList.add("active");
        })
        desktop.addEventListener('mousedown', selectother)

        this.bringToTop()

        this.makeDraggable()
        if(!configs.no_resizable)this.makeResizable()
    }
    makeDraggable(){
        for (const eventName of ['mousedown', 'touchstart']) {
            this.window.addEventListener(eventName, () => {//アロー関数にするとthisがインスタンスを示すようになる
                this.bringToTop()
            }, { passive: true });
        }
        const mdown = (e) => {
            this.window.classList.add("dragging");
            var event = e;
            //タッチデイベントとマウスのイベントの差異を吸収
            if (e.type !== "mousedown") {
                event = e.changedTouches[0];
            }
            //要素内の相対座標
            this.localx = event.pageX - this.window.offsetLeft;
            this.localy = event.pageY - this.window.offsetTop;
            //ムーブイベントにコールバック
            document.body.addEventListener("mousemove", mmove, { passive: false });
            document.body.addEventListener("touchmove", mmove, { passive: false });
    
            //マウスボタンが離されたとき、またはカーソルが外れたとき発火
            this.window.addEventListener("mouseup", mup, { passive: true });
            this.window.addEventListener("touchend", mup, { passive: true });
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
    
            this.window.style.top = event.pageY - this.localy + "px";
            this.window.style.left = event.pageX - this.localx + "px";
        }
        //マウスボタンが上がったら発火
        const mup = (e) => {
            //ムーブベントハンドラの消去
            document.body.removeEventListener("mousemove", mmove, false);
            document.body.removeEventListener("touchmove", mmove, false);
            this.window.removeEventListener("mouseup", mup, false);
            this.window.removeEventListener("touchend", mup, false);
            document.body.removeEventListener("mouseleave", mup, false);
            document.body.removeEventListener("touchleave", mup, false);
            //クラス名 .drag も消す
            this.window.classList.remove("dragging");
        }
    
        //ウィンドウバークリックで発火
        this.window.firstElementChild.addEventListener("mousedown", mdown, { passive: true });
        this.window.firstElementChild.addEventListener("touchstart", mdown, { passive: true });
    }
    makeResizable(){
        Array.from(this.window.lastElementChild.children).forEach(
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

            const mousedown = (e)=>{
                /** @type {any} */
                let event = e
                if (e.type !== "mousedown") {
                    //@ts-ignore
                    event = e.changedTouches[0];
                }
                this.localx = event.pageX - this.window.offsetLeft;
                this.localy = event.pageY - this.window.offsetTop;
                let position = this.bodyElem.getBoundingClientRect()

                const move = (e) => {
                    let event = e;
                    if (e.type !== "mousemove") {
                        event = e.changedTouches[0];
                    }
                    //フリックしたときに画面を動かさないようにデフォルト動作を抑制
                    e.preventDefault();
                    if (bottom) this.window.style.height = event.pageY - position.top + this.titleElem.clientHeight + "px";
                    if (right) this.window.style.width = event.pageX - position.left + "px";
                    if (top){
                        this.window.style.top = event.pageY - this.localy + "px";
                        this.window.style.height = position.top + position.height - event.pageY + this.localy + "px";
                    }
                    if (left){
                        this.window.style.left = event.pageX - this.localx + "px";
                        this.window.style.width = position.left + position.width - event.pageX + this.localx + "px";
                    }
                }
                const up = (e) => {
                    document.body.removeEventListener("mousemove", move, false);
                    document.body.removeEventListener("touchmove", move, false);
                    this.window.lastElementChild.firstElementChild.removeEventListener("mouseup", up, false);
                    this.window.lastElementChild.firstElementChild.removeEventListener("touchend", up, false);
                    document.body.removeEventListener("mouseleave", up, false);
                    document.body.removeEventListener("touchleave", up, false);
                }
                document.body.addEventListener("mousemove", move, { passive: false });
                document.body.addEventListener("touchmove", move, { passive: false });
        
                //マウスボタンが離されたとき、またはカーソルが外れたとき発火
                this.window.addEventListener("mouseup", up, { passive: true });
                this.window.addEventListener("touchend", up, { passive: true });
                document.body.addEventListener("mouseleave", up, { passive: true });
                document.body.addEventListener("touchleave", up, { passive: true });
            }
            child.addEventListener("mousedown", mousedown, { passive: true });
            child.addEventListener("touchstart", mousedown, { passive: true });
        })
    }
    reload(){
        this.bodyElem.innerHTML = this.html
        this.titleElem.textContent = this.title
    }
    bringToTop(){
        if(this.parent.windowindex > this.window.style["z-index"])
            this.window.style["z-index"] = ++this.parent.windowindex;

        //一旦すべてのウィンドウを非アクティブ化
        this.parent.windows.forEach(window =>{
        })
        for(let windowid in this.parent.windows){
            this.parent.windows[windowid].window.classList.remove("active");
        }

        //自分をアクティブ化
        this.window.classList.add("active");
    }
    destroy(){
        if (this.parent.windows[this.window_id]){
            delete this.parent.windows[this.window_id]
        }
        this.window.remove()
    }
}

export function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}

export function RandomData(){
    return "data-" + Math.random().toString(32).substring(2)
}