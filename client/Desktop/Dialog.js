'use strict';

import { WindowManager } from "./Desktop.js";

/** 
 * @typedef  {Object} Config - ウィンドウ用コンフィグ
 * @property {!String=} style - ウィンドウエレメントに適用されるスタイル
 * @property {!Boolean=} no_xbutton - ウィンドウの閉じるボタンの非表示
 * @property {!Boolean=} no_fullscrbutton - ウィンドウのフルスクリーンボタンの非表示
 * @property {!Boolean=} no_minimizebutton - ウィンドウの最小化ボタンの非表示
 */

export class Dialog{
    /**
     * @param {String} html - HTML文字列
     * @param {String} title - タイトル文字列
     * @param {Config} configs - ウィンドウ用コンフィグ
     */
    constructor(html, title, configs){
        /** @type {string} */
        this.html = html;
        /** @type {string} */
        this.title = title;
        this.parent = WindowManager;
        /** @type {Config} */
        this.configs = configs;
        this.window_id = "";

        // デフォルトで非表示
        if(this.configs.no_xbutton==undefined)this.configs.no_xbutton = true
        if(this.configs.no_fullscrbutton==undefined)this.configs.no_fullscrbutton = true
        if(this.configs.no_minimizebutton==undefined)this.configs.no_minimizebutton = true

        let windowhtml = createElementFromHTML(`
        <div class="overlay">
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
            </div>
        </div>`)
        this.window = this.parent.windowarea.insertAdjacentElement('afterbegin', windowhtml)
        /** @type {HTMLElement} *///@ts-ignore
        this.drag = this.window.firstElementChild
        this.drag.style.position = "relative";
        for (const eventName of ['mousedown', 'touchstart']) {
            this.drag.addEventListener(eventName, () => {//アロー関数にするとthisがインスタンスを示すようになる
                this.bringToTop()
            }, { passive: true });
        }
        
        this.bodyElem = this.drag.lastElementChild
        this.titleElem = this.drag.firstElementChild.firstElementChild

        let btns = this.drag.firstElementChild.lastElementChild
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
        this.window.remove()
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}
