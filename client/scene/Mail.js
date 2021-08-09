'use strict';
import { Window } from './Window.js';
import { VirusEvent } from './VirusEvent.js';

export class Mail extends Window {//メールウィンドウ
    preload() {
        this.load.image('mailicon', 'images/mailicon.png')
        this.title_text = "メール"
        this.width = 800
        this.mails = this.get_mails()
        this.mail_width = 300
        this.mail_block = {}
    }
    get_mails() {//メール一覧取得(実際はネットから持ってくるか、自動生成でそれっぽいの用意する)
        let mails = [["テストメール", `先生へ

4Fの太郎です。

例の物を添付ファイルとしてお送り致します。
ご確認の方よろしくお願いします。
        
舞鶴工業高等専門学校 機械制御情弱科 4年 舞鶴 太郎
Email: taro@maizuru.kosen.ac.jp`,{filename:"file.exe",func:() => {this.desktop.CreateWindow(VirusEvent,0,0)}}
        ], ["メール2", "本文2"]]
        return mails
    }
    show_mail(mail) {
        this.mail_title.setText(mail[0])
        this.mail_text.setText(mail[1])
    }
    fix_mail(text) {
        text = text.replaceAll("\n", " ")
        text = text.substr(0, 15)
        return text
    }
    create_after() {//create関数はすでにWindowクラスで使われてるので、そこからcreate_afterを呼び出してる
        this.mail_title = this.add.text(300, this.menu_height + 5, "", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        this.mail_text = this.add.text(300, this.menu_height + 40, "", { color: "#000", font: "15px Yu Gothic", wordWrap: { width: this.mail_width, useAdvancedWrap: true } }).setOrigin(0)
        this.mails.forEach((mail, i) => {
            let mailblock = this.add.rectangle(5, this.menu_height + 2 + i * 50, 280, 48, 0xf0f0f0).setOrigin(0).setInteractive().setDepth(-1000)
            this.add.text(5, this.menu_height + 2 + i * 50, this.fix_mail(mail[0]), { color: "#000", font: "15px Yu Gothic" }).setOrigin(0)
            this.add.text(5, this.menu_height + 15 + i * 50, this.fix_mail(mail[1]), { color: "#555", font: "15px Yu Gothic" }).setOrigin(0)

            //上20pxと下&左右5pxくらいウィンドウが専有してるので基準を少しずらしてる
            mailblock.on('pointerdown', () => {
                this.show_mail(mail)
                // this.desktop.CreateWindow(VirusEvent,0,0)
                if(typeof mail[2] == 'object') {
                    this.btngroup = this.add.group();
                    let btn = this.add.rectangle(0, 0, 100, 60, 0xaaaaaa).setOrigin(0).setInteractive()
                    let txt = this.add.text(0, 0, mail[2]["filename"], { color: "#000", font: "30px Yu Gothic" }).setOrigin(0.5)
                    this.btngroup.add(btn)
                    this.btngroup.add(txt)
                    btn.on('pointerdown', () => {
                        mail[2]["func"]()
                        this.desktop.Reportfunc({
                            type: "task",
                            status: "failed",
                            task: {
                                id: 1,
                                "point": 150,
                                "broadcast": [{ type: "attack", attack: {type: "trojan"} }]
                            }
                        })
                    }, this);
                    this.btngroup.setXY(this.width * 0.9, this.height * 0.9).setOrigin(0.5)
                }else if(typeof this.btngroup == 'object'){
                    this.btngroup.clear(true,true)
                }
                this.desktop.Reportfunc({
                    type: "task",
                    status: "success",
                    task: {
                        id: 1,
                        "point": 150,
                    }
                })//結果送信テスト
            }, this);//最後にthis入れないとthisの参照先が変わってしまう
        }, this);
    }
    // update() {
    //     if (this.width - 300 > 50) {
    //         this.mail_width = this.width - 300
    //     }
    //     this.mail_text.setStyle({ color: "#000", font: "15px Yu Gothic", wordWrap: { width: this.mail_width, useAdvancedWrap: true } })
    // }
}