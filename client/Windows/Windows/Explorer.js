'use strict'
import { Window,RandomData,createElementFromHTML } from "../Window.js"
import { Root,Folder,File,Link } from '../../System/FileSystem.js'
import { AddContextMenu } from '../../Functions/contextmenu.js'
import { TextInputWindow, YesNoButtonWindow } from '../../Functions/InputWindow.js'


const html = `
<div style="height:100%;display:flex;flex-direction:column;">
    <div style="display:flex;margin:0.2em;flex-shrink:0;">
        <div style="background-image: url(/images/explorer/back.svg);width:1em;height:1em;background-size:contain;margin:2px"></div>
        <input style="flex:1;">
        <button>Go</button>
    </div>
    <div style="flex:1;">
    </div>
</div>
`

const style="width:40em;height:30em;"

export class Explorer extends Window {
    /** @param {Folder|String=} folder */
    constructor(folder) {
        super(html, "Explorer",{style:style,window_id:"Explorer"+RandomData()})
        if(this.creationFailed)return
        
        /** @type {HTMLElement} *///@ts-ignore
        this.filesarea = this.bodyElem.firstElementChild.lastElementChild
        this.addressarea = this.bodyElem.firstElementChild.firstElementChild.firstElementChild.nextElementSibling
        /** @type {HTMLButtonElement} *///@ts-ignore
        this.backbutton = this.bodyElem.firstElementChild.firstElementChild.firstElementChild
        /** @type {HTMLInputElement} *///@ts-ignore
        this.patharea = this.backbutton.nextElementSibling
        /** @type {HTMLButtonElement} *///@ts-ignore
        this.gobutton = this.patharea.nextElementSibling
        if(typeof folder == "string") 
            /** @type {Folder} *///@ts-ignore
            this.currentFolder = Root.GetPath(folder)
        else this.currentFolder = folder?folder:Root
        this.open(this.currentFolder)
        
        this.backbutton.addEventListener("click",()=>{
            if(this.currentFolder.parent != null)this.open(this.currentFolder.parent)
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

        let menu = createElementFromHTML(`
            <ul>
                <li>Create New Folder</li>
                <li>Create New File</li>
                <hr>
                <li>Refresh</li>
            </ul>
            `)
        menu.firstElementChild.addEventListener("click",()=>{
            new TextInputWindow("フォルダ名","フォルダ名を入力してください",(text)=>{
                if(!text)return
                this.currentFolder.Mkdir(text)
                this.refresh()
            })
        })
        menu.firstElementChild.nextElementSibling.addEventListener("click",()=>{
            new TextInputWindow("ファイル名","ファイル名を入力してください",(text)=>{
                if(!text)return
                this.currentFolder.Touch(text)
                this.refresh()
            })
        })
        menu.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener("click",()=>{
            this.refresh()
        })
        AddContextMenu(this.filesarea,menu)
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
                        this.bodyElem.removeEventListener('mousedown', selectother)
                    }
                }
                if (!temp.classList.contains("selected")) this.bodyElem.addEventListener('mousedown', selectother)
                temp.classList.add("selected");
            })
            this.filesarea.insertAdjacentElement('beforeend',temp)
            
            let menu = createElementFromHTML(`
                <ul>
                    <li>Delete</li>
                    <li>Rename</li>
                </ul>
                `)
            menu.firstElementChild.addEventListener("click",()=>{
                new YesNoButtonWindow("削除","ファイルを削除しますか?",(del)=>{
                    if(!del)return
                    item.Delete()
                    this.refresh()
                })
            })
            menu.firstElementChild.nextElementSibling.addEventListener("click",()=>{
                let itemname
                if(item.isdir)itemname = "フォルダ名"
                else itemname = "ファイル名"
                new TextInputWindow(itemname,`${itemname}を入力してください`,(text)=>{
                    if(!text)return
                    item.Rename(text)
                    this.refresh()
                })
            })
            AddContextMenu(temp,menu)
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