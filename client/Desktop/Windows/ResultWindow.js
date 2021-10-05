'use strict'
import { Window, RandomData } from "../Window.js"
import { CallWindow,Result,SystemConfigs, Task } from "../Desktop.js"
import { Advices,Flags } from "../../Functions/showAdvices.js"

const RandData = RandomData()

const html = `
<div ${RandData}>
  <div>
    <h1>結果</h1>
    <table>
    </table>
  </div>
  <hr>
  <div>
    <h1>アドバイス: </h1>
  </div>
  <style>
    div[${RandData}] h1,h2{
      margin: 0.2em 0;
    }
    div[${RandData}] .advices{
      width: 95%;
      margin: 0 auto;
      overflow:auto;
    }
    div[${RandData}] .advicediv{
      margin-bottom: 1em;
    }
    div[${RandData}] .advicediv + .advicediv::before{
      content:" ";
      display: block;
      height: 1px;
      width: 90%;
      margin: 0.2em auto;
      background-color: black;
    }
    div[${RandData}] table {
      border: black solid 1px;
      margin: 0 auto;
      table-layout: fixed;
      width: 90%;
      border-collapse: collapse;
    }
    div[${RandData}] tr>td {
      text-align: center;
      border: black solid 1px;
      background-color: white;
      padding: 0.2em 1em;
    }
    div[${RandData}] td:nth-child(1){
      white-space: nowrap;
      width: 10em;
    }
    div[${RandData}] td:nth-child(2){
      white-space: nowrap;
      width: 1em;
    }
    div[${RandData}] td:nth-child(3){
      text-align:left;
    }
    div[${RandData}] tr>td>span::after{
      content:", "
    }
    div[${RandData}] tr>td>span:last-of-type::after{
      content:none
    }
    div[${RandData}] p{
      margin:0;
    }
    div[${RandData}]{
      height: 100%;
      overflow: auto;
    }
  </style>
</div>
`

export class ResultWindow extends Window {
  constructor() {
    super(html, "Result",{style:"width:40em;height:20em;"})
    if(this.creationFailed)return

    this.table = this.bodyElem.firstElementChild.firstElementChild.nextElementSibling

    this.temp = {
      table: document.createElement("table"),
      advices: document.createElement("div")
    }
    this.temp.advices.classList.add("advices")

    this.addRevenueAndScore()
    this.addSucceed()
    this.addFailed()
    this.addFlags()
    
    this.table = this.bodyElem.firstElementChild.firstElementChild.insertAdjacentElement('beforeend',this.temp.table)

    this.bodyElem.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.insertAdjacentElement('beforeend',this.temp.advices)
  }
  addSucceed(){
    let succeed = createElementFromHTML(`<tr>
      <td>成功したタスク</td>
      <td>${Task.SucceedTask.length}</td>
      <td>
      </td>
    </tr>`)
    
    let list = succeed.lastElementChild
    Task.SucceedTask.forEach(task=>{
      let temp = createElementFromHTML(`<span>${task}</span>`)
      list.insertAdjacentElement('beforeend',temp)
    })
    this.temp.table.insertAdjacentElement('beforeend',succeed)
  }
  addFailed(){
    let failed = createElementFromHTML(`<tr>
      <td>失敗したタスク</td>
      <td>${Task.FailedTask.length}</td>
      <td>
      </td>
    </tr>`)
    
    let list = failed.lastElementChild
    Task.FailedTask.forEach(task=>{
      let temp = createElementFromHTML(`<span title="クリックして詳細をみる">${task}</span>`)
      list.insertAdjacentElement('beforeend',temp)

      let adv = createElementFromHTML(`
      <div class="advicediv">
        <h1>${task}</h1>
        <p>${Advices[task]}</p>
      </div>`)
      this.temp.advices.insertAdjacentElement('beforeend',adv)
      temp.addEventListener('click',()=>{adv.scrollIntoView()})
    })
    this.temp.table.insertAdjacentElement('beforeend',failed)
  }
  addRevenueAndScore(){
    let revenue = createElementFromHTML(`<tr>
      <td>収益</td>
      <td></td>
      <td>${Result.Revenue}</td>
    </tr>`)
    this.temp.table.insertAdjacentElement('beforeend',revenue)
    let score = createElementFromHTML(`<tr>
      <td>セキュリティスコア</td>
      <td></td>
      <td>${Result.SecurityScore}</td>
    </tr>`)
    this.temp.table.insertAdjacentElement('beforeend',score)
  }
  addFlags(){
    let flags = createElementFromHTML(`<tr>
      <td>フラグ</td>
      <td>${Result.Flag.length}</td>
      <td>
      </td>
    </tr>`)
    let list = flags.lastElementChild
    Result.Flag.forEach(flag=>{
      let temp = createElementFromHTML(`<span title="クリックして詳細をみる">${flag}</span>`)
      list.insertAdjacentElement('beforeend',temp)

      let adv = createElementFromHTML(`
      <div class="advicediv">
        <h1>${flag}</h1>
        <p>${Flags[flag]}</p>
      </div>`)

      this.temp.advices.insertAdjacentElement('beforeend',adv)
      temp.addEventListener('click',()=>{adv.scrollIntoView()})
    })
    this.temp.table.insertAdjacentElement('beforeend',flags)
  }
}

function createElementFromHTML(html) {
  let template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstElementChild;
}