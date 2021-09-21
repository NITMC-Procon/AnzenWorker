'use strict'
import { Window } from "../Window.js"
import { CallWindow } from "../Desktop.js"
import { Mail } from "./Mail.js"
import { WiFi } from "./WiFi.js"

const html = `
<div style="display: flex;width: 100%;height: 100%;user-select:none;">
  <div style="width: 15em;overflow:auto;">
    <div style="display: flex;justify-content: center;align-items: center;flex-direction: row;">
        <h2 style="padding: 0.2em;margin:0;text-align: center;">タスク一覧</h2>
    </div>
    <div>
    </div>
  </div>
  <div class="task">
    <h1 style="margin:10px;">タスク詳細</h1>
    <p style="margin:2px 0 0 0"></p>
    <div class="file" style="display:none;">受領</div>
  </div>
</div>
<style>
  .taskbox {
    margin: 0.2em;
    padding: 0.2em;
    background-color: rgb(235, 235, 235);
    overflow: hidden;
  }

  .taskbox>* {
    margin: 0;
    white-space: nowrap;
  }

  .task {
    border-left: black solid 2px;
    padding-left: 0.2em;
    padding-right: 0.2em;
    width: calc(100% - 15em);
    overflow:auto;
  }

  .file {
    display: inline-block;
    padding: 0.5em 1em;
    background-color: #33cccc;
    color: black;
    margin: 2px;
  }
</style>`
const style = "width:40em;height:20em;"

export let tasklist = [
    {
        title: "メール確認",
        text: `届いたメールを確認してみよう\n\n中には、怪しいメールもあるから注意しよう\n間違って開いてしまうと大変なことになるかも...`,
        class: "Mail"
    }, {
        title: "Wi-Fi接続",
        text: `Wi-Fiに接続してみよう\n\nいろんな接続先が出てくるけど、一番安全なものを選ぼう！\nセキュリティのないWi-Fiに接続してしまうと、大変なことになるかも...`,
        class: "WiFi"
    }
]

export class JobManager extends Window {
    constructor(parent) {
        super(html, "タスク管理", parent, { style: style });

        /** @type {HTMLElement} *///@ts-ignore
        this.tasklist = this.bodyElem.firstElementChild.firstElementChild.lastElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.tasktitlearea = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
        /** @type {HTMLElement} *///@ts-ignore
        this.taskarea = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.tasktextarea = this.tasktitlearea.nextElementSibling
        /** @type {HTMLElement} *///@ts-ignore
        this.taskacceptbutton = this.tasktextarea.nextElementSibling

        this.refreshtasks()

        this.taskacceptbutton.addEventListener('click', () => {
            this.accpettask()
        })
    }
    select(task) {
        this.keep = task
        this.tasktitlearea.textContent = task.title ? task.title : ""
        //@ts-ignore
        this.tasktextarea.innerText = task.text ? task.text : ""
        this.taskacceptbutton.style.display = (task ? "" : "none")
    }
    refreshtasks() {
        this.tasklist.innerHTML = ""
        tasklist.forEach((task) => {
            let temp = createElementFromHTML(`<div class="taskbox">
                    <p>${task.title}</p>
                </div>`)
            temp.addEventListener('click', () => {
                this.select(task)
            })
            this.tasklist.insertAdjacentElement('beforeend', temp)
        })
    }
    accpettask() {
        let windowName = "Window_" + this.keep.class
        CallWindow(this.keep.class, windowName)
        this.destroy()
    }
}

function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}
