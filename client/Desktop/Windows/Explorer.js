'use strict'
import { Window,RandomData,createElementFromHTML } from "../Window.js"
import { Root,Folder,File,Link } from '../FileSystem.js'


const RandData = RandomData()

const html = `
<div ${RandData}>
    <div style="display:flex;margin:0.2em;">
        <div style="background-image: url(/images/explorer/back.svg);width:1em;height:1em;background-size:contain;margin:2px"></div>
        <input style="flex:1;">
        <button>Go</button>
    </div>
    <div>
    </div>
</div>
<style>

div[${RandData}] .icon{
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80px;
    padding: 10px;
    border:2px solid transparent;
}
div[${RandData}] .icon>.icon_image{
    object-fit: contain;
    width: 40px;
    height: 40px;
}
div[${RandData}] .icon>.icon_text{
    font-size: 0.9rem;
    padding: 1px 3px;
    word-wrap: break-word;
    border-width: 1px;
    border-style: dotted;
    border-color: transparent;
    color: white;
    text-align: center;
    text-shadow: 1px 1px 2px #000000; 
}
div[${RandData}] .icon.selected>.icon_image {
    filter: brightness(0.5) contrast(1.2) sepia(100%) hue-rotate(180deg) saturate(20);
}
div[${RandData}] .icon.selected>.icon_text{
    border-color: white;
    background-color: rgb(0, 81, 196);
}
</style>
`

const style = "width: 20em;height: 15em;"
export class Explorer extends Window {
    constructor() {
        super(html, "Explorer",{style:style})
        this.filesarea = this.bodyElem.firstElementChild.lastElementChild
        this.addressarea = this.bodyElem.firstElementChild.firstElementChild.firstElementChild.nextElementSibling
        /** @type {HTMLButtonElement} *///@ts-ignore
        this.backbutton = this.bodyElem.firstElementChild.firstElementChild.firstElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.patharea = this.backbutton.nextElementSibling
        /** @type {HTMLButtonElement} *///@ts-ignore
        this.gobutton = this.patharea.nextElementSibling
        this.currentFolder = Root
        this.open(Root)
        this.backbutton.addEventListener("click",()=>{
            this.open(this.currentFolder.parent)
        })
        
        
        this.gobutton.addEventListener('click',()=>{
            let item = Root.GetPath(this.patharea.value)
            if(item != null) this.open(item)
            else this.patharea.value = this.currentFolder.Pwd()
        })

        this.patharea.addEventListener('keypress',(e)=>{
            if (e.code === "Enter") {
                let item = Root.GetPath(this.patharea.value)
                if(item != null) this.open(item)
                else this.patharea.value = this.currentFolder.Pwd()
            }
        })

    }
    refresh(){
        this.filesarea.innerHTML = ""
        this.currentFolder.children.forEach(item=>{
            let temp = createElementFromHTML(`<div class="icon">
            <img src="${item.icon}" class="icon_image">
            <span class="icon_text">${item.name}</span>
            </div>`)
            if(item.isdir){
                temp.addEventListener('dblclick',()=>{
                    this.open(item)
                })
            }else{
                temp.addEventListener('dblclick',()=>{
                    item.Open()
                })
            }
            
            temp.addEventListener('mousedown', (e) => {
                const selectother = (e) => {
                    if (e.target.closest('.selected') !== temp) {
                        temp.classList.remove("selected");
                        this.filesarea.removeEventListener('mousedown', selectother)
                    }
                }
                if (!temp.classList.contains("selected")) this.filesarea.addEventListener('mousedown', selectother)
                temp.classList.add("selected");
            })
            this.filesarea.insertAdjacentElement('beforeend',temp)
        })
        this.patharea.value = this.currentFolder.Pwd()
    }
    open(target){
        if(target.isdir){
            this.currentFolder = target
            this.refresh()
        }
        else target.Open()
    }
}