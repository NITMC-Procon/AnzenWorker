// 初期から呼び出されるサービス

import { AdVirusView1 } from "../../Windows/Window/AdVirusView1.js";
import { Service } from "../ServiceClass.js"


export class AdVirusService1 extends Service {
    constructor(){
        super()
        this.timer = setInterval(this.openAd.bind(this), 1000*20);//20秒ごとに呼ぶ
        for(let i = 0;i<6;i++){
            this.openAd()
        }
    }
    destructor(){
        clearInterval(this.timer)
    }
    openAd(){
        new AdVirusView1();
    }
}