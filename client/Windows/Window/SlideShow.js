'use strict'
import { Window } from "../Window.js"
import { contents } from "../../Services/Service/YoTubeContents.js"

const html = `
<div style = "width:100%; height:100%; background:black;">
  <div style = "width:100%; height:90%;">
    
  </div>
  <div style = "display:flex; width:100%; height:10%; background:gray;">
    <div id = "left" style = "width:10%; height:100%; color:white; margin-left:10%;">
      <b>←</b>
    </div>
    <div id = "right" style = "width:10%; height:100%; color:white;">
      <b>→</b>
    </div>
  </div>
</div>

<style>
  .is_hidden{
    display: none;
  }
  </style>`
const style = "width:40em;height:27em;"

export class SlideShow extends Window {
  constructor(slide) {
    super(html, "SlideShow", { style: style });
    if (this.creationFailed) return

    /** @type {HTMLElement} *///@ts-ignore
    this.slidebox = this.bodyElem.firstElementChild.firstElementChild
    this.left = this.slidebox.nextElementSibling.firstElementChild
    this.right = this.left.nextElementSibling

    this.slidebox.insertAdjacentHTML('beforeend', slide);

    // ページ番号をリセット
    var pagenum = 0;
    // 1ページ目以外を非表示
    for (let k = 1; k < this.slidebox.childElementCount; k++) {
      this.slidebox.children[k].classList.add('is_hidden');
    }

    this.left.addEventListener('click', () => {
      if (1 <= pagenum && pagenum <= (this.slidebox.childElementCount)) {
        this.slidebox.children[pagenum].classList.add('is_hidden');
        this.slidebox.children[pagenum - 1].classList.remove('is_hidden');
        pagenum--;
      }
    })
    this.right.addEventListener('click', () => {
      if (0 <= pagenum && pagenum <= (this.slidebox.childElementCount - 2)) {
        this.slidebox.children[pagenum].classList.add('is_hidden');
        this.slidebox.children[pagenum + 1].classList.remove('is_hidden');
        pagenum++;
      }
    })
  }
}
