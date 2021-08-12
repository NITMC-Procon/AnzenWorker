'use strict';
import { Window } from './Window.js';
import { Wifi } from './Wifi.js';
import { Mail } from './Mail.js';

export class JobManager extends Window {//メールウィンドウ
    preload() {
        this.title_text = "ジョブ管理"
        this.width = 800
        this.jobs = this.get_jobs()
        this.mail_width = 300
        this.mail_block = {}
        this.open_window = -1;  // 開くウィンドウの番号
    }
    get_jobs() {//ジョブ一覧取得
        let jobs = [["メール確認", `

届いたメールを確認してみよう

中には、怪しいメールもあるから注意しよう
間違って開いてしまうと大変なことになるかも...
        
        `, `Mail`], ["Wi-Fi接続", `

Wi-Fiに接続してみよう

いろんな接続先が出てくるけど、一番安全なものを選ぼう！
セキュリティのないWi-Fiに接続してしまうと、大変なことになるかも...

        `, "Wifi"]]
        return jobs
    }
    show_job(job) {
        this.job_title.setText(job[0])
        this.job_text.setText(job[1])
    }
    fix_job(text) {
        text = text.replaceAll("\n", " ")
        text = text.substr(0, 15)
        return text
    }
    create_after() {//create関数はすでにWindowクラスで使われてるので、そこからcreate_afterを呼び出してる
        this.job_title = this.add.text(300, this.menu_height + 5, "", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        this.job_text = this.add.text(300, this.menu_height + 40, "", { color: "#000", font: "15px Yu Gothic", wordWrap: { width: this.mail_width, useAdvancedWrap: true } }).setOrigin(0)

        //受注ボタン作成
        let acceptblock = this.add.rectangle(550, 300, 120, 48, 0xf0f0f0).setOrigin(0).setInteractive().setDepth(-1000)
        this.accept_text = this.add.text(580, 308, "受注", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)

        this.jobs.forEach((job, i) => {
            let jobblock = this.add.rectangle(5, this.menu_height + 2 + i * 50, 280, 48, 0xf0f0f0).setOrigin(0).setInteractive().setDepth(-1000)
            this.add.text(15, this.menu_height + 10 + i * 50, this.fix_job(job[0]), { color: "#000", font: "25px Yu Gothic" }).setOrigin(0)

            jobblock.on('pointerdown', () => {
                this.show_job(job)
                this.open_window = i;
            }, this);//最後にthis入れないとthisの参照先が変わってしまう

        }, this);

        //受注ボタンが押された時
        acceptblock.on('pointerdown', () => {
            // 0番目のウィンドウ（メール）
            if (this.open_window == 0) {
                // メールウィンドウ作成
                this.desktop.CreateWindow(Mail);
            }
            else if (this.open_window == 1) {
                // Wi-Fiウィンドウ作成
                this.desktop.CreateWindow(Wifi);
            }

            //　ジョブ管理画面を閉じる
            this.desktop.DestroyWindow(this);
            //　開くウィンドウの番号をリセット
            this.open_window = -1;
        })
    }
    // update() {
    //     if (this.width - 300 > 50) {
    //         this.mail_width = this.width - 300
    //     }
    //     this.mail_text.setStyle({ color: "#000", font: "15px Yu Gothic", wordWrap: { width: this.mail_width, useAdvancedWrap: true } })
    // }

}