// 初期から呼び出されるサービス

import { joblist } from "../../Windows/Window/JobManager.js"
import { Service } from "../ServiceClass.js"
import { Mail } from "../../Windows/Window/Mail.js"
import { WiFi } from "../../Windows/Window/WiFi.js"
import { Store } from "../../Windows/Window/Store.js"
import { Notify } from "../../Functions/notify.js"
import { Task } from "../../System/Desktop.js"

const jobs = [
    {
        title: "メールを確認",
        text: `届いたメールを確認する\n\nメールを確認しましょう。中には怪しいメールもあるので注意しましょう\n間違って開いたりすると大変なことになってしまうかもしれません…`,
        class: Mail
    }, {
      title: "Wi-Fiに接続",
      text: `Wi-Fiに接続する\n\n様々な接続先の中から、一番安全なものを選びましょう。\n誤ったWi-Fiに接続すると、大変なことになってしまうかもしれません…`,
      class: WiFi
    }, {
      title: "ソフトをインストール",
      text: `必要なソフトをインストールする\n\nPCを利用する上で必要なソフトをインストールしましょう。場合によっては、`,
      class: Store
    }
  ]

export class JobReciever extends Service {
    create(){
        this.jlist = jobs.slice();//.slice()でコピーしてる(そのままだと参照コピー)
        this.jtimer = setInterval(this.jreciever.bind(this), 1000*8);//8秒ごとに呼ぶ
        this.jrec()
    }
    destroy(){
        clearInterval(this.jtimer)
    }
    jreciever(){
        if(Math.random()>0.4){//約3/5
            this.jrec()
        }
    }
    jrec(){
        let index = Math.floor(Math.random() * this.jlist.length)
        if(!this.jlist[index]) return  // なにもないのなら帰れ
        joblist.push(this.jlist[index])
        Notify("新しいタスク:"+this.jlist[index].title)
        this.jlist.splice(index,1)//要素を削除(deleteは使えない)
        if(this.parent.windows["Window_JobManager"]){
            if(this.parent.windows["Window_JobManager"].refreshtasks)this.parent.windows["Window_JobManager"].refreshtasks.bind(this.parent.windows["Window_JobManager"])()
        }
    }
}