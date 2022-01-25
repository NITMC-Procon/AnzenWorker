import { RandomData, Window } from '../Windows/Window.js'

export class TextInputWindow extends Window {
    /**
     * @param {String} title - タイトル
     * @param {String} text - テキスト
     * @param {(text:String)=>void} callback - コールバック関数
     */
    constructor(title,text,callback) {
        let html = `
        <div inputwindow style="display:flex;flex-direction:column;margin:0.5em 1em">
            <p>${text}</p>
            <input type="text"></input>
            <div style="display:flex;justify-content: space-around;">
                <button>キャンセル</button>
                <button>OK</button>
            </div>
        </div>
        <style>
        div[inputwindow] p{
            margin:0;
        }
        div[inputwindow] input{
            margin:2px auto;
            width:100%;
        }
        </style>
        `
        super(html,title,{no_minimizebutton:true,no_maxmizebutton:true,no_resizable:true,window_id:"TextInput"+RandomData()})
        if(this.creationFailed)return

        this.callback = callback
        /** @type {HTMLInputElement} *///@ts-ignore
        this.input = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling
        this.canselbutton = this.input.nextElementSibling.firstElementChild
        this.okbutton = this.canselbutton.nextElementSibling

        this.input.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                this.send(this.input.value);
            }
        });
    
        this.canselbutton.addEventListener('click', (e) => {
            this.destroy()
        });
        this.okbutton.addEventListener('click', (e) => {
            this.send(this.input.value);
        });
    }
    send(text){
        this.callback(text)
        this.callback = null
        this.destroy()
    }
}

export class YesNoButtonWindow extends Window {
    /**
     * @param {String} title - タイトル
     * @param {String} text - テキスト
     * @param {(ans:Boolean)=>void} callback - コールバック関数
     */
    constructor(title,text,callback) {
        let html = `
        <div inputwindow style="display:flex;flex-direction:column;margin:0.5em 1em">
            <p>${text}</p>
            <div style="display:flex;justify-content: space-around;">
                <button>いいえ</button>
                <button>はい</button>
            </div>
        </div>
        <style>
        div[inputwindow] p{
            margin:0;
        }
        div[inputwindow] input{
            margin:2px auto;
            width:100%;
        }
        </style>
        `
        super(html,title,{no_minimizebutton:true,no_maxmizebutton:true,no_resizable:true,window_id:"YesNoInput"+RandomData()})
        if(this.creationFailed)return

        this.callback = callback
        /** @type {HTMLInputElement} *///@ts-ignore
        this.nobutton = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
        this.yesbutton = this.nobutton.nextElementSibling

        this.nobutton.addEventListener('click', (e) => {
            this.send(false);
        });
        this.yesbutton.addEventListener('click', (e) => {
            this.send(true);
        });
    }
    send(text){
        this.callback(text)
        this.callback = null
        this.destroy()
    }
}