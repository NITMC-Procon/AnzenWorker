'use strict'
import { Window } from "../Window.js"
import { SystemConfigs } from "../../System/System.js"
import { WizardOverlay } from "../../System/WizardOverlay.js";

let initwizHtml = `
<style>
#initwizardcontainer{
    width: 100%;
    height: 100%;
    background-color: antiquewhite;
    color: black;
}
</style>
<div id="initwizardcontainer">
<div>チュートリアルを開始しますか？</div>
<div>開始する場合はOKをクリックして下さい。</div>
<div style="display: inline-block;text-align: right;width: 100%;">
    <button id="wiz_ok" style="width: 8rem;height: 2rem;">OK</button>
</div>
</div>
`;

const style = "width:30rem;height:10rem"


export class InitWizard extends Window {
  constructor() {
    super(initwizHtml, "初回ウィザード", { style: style });
    if(this.creationFailed)return

    let context = this;

    let bwok = document.getElementById('wiz_ok');

    bwok.onclick = function(){
        WizardOverlay();
        SystemConfigs.isWizardClosed = true;
        context.destroy();
    }
  }
}