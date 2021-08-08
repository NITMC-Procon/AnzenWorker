'use strict';
import { Window } from './Window.js';

export class Wifi extends Window {//wi-fiウィンドウ
    preload() {
        this.load.image('wifiicon', 'images/wifiicon.png')
        this.load.image('padlock', 'images/padlock.png')
        this.load.image('padunlock', 'images/padunlock.png')
        this.title_text = "  Wi-Fiの設定"
        this.width = 300
        this.wifis = this.get_wifis()
        this.wifi_width = 150
        this.wifi_block = {}
        this.connect = "-1";
    }
    get_wifis() {//Wi-Fi一覧取得(実際はネットから持ってくるか、自動生成でそれっぽいの用意する)
        let wifis = [
            ["Anzenworker", "802.1x", 1, 3],
            ["FREE_INTE", "open", 0, 3],
            ["Anzenworker", "WPA2-PSK", 1, 2]
        ]
        return wifis
    }
    show_wifi(wifi) {
        this.wifi_title.setText(wifi[0])
    }
    connect_wifi(wifi) {
        this.connect_text.setText("接続済み")
        this.connect = wifi[0];
    }
    fix_wifi(text) {
        text = text.replaceAll("\n", " ")
        text = text.substr(0, 15)
        return text
    }
    create_after() {//create関数はすでにWindowクラスで使われてるので、そこからcreate_afterを呼び出してる
        // 選んだ時に出てくるWi-Fi
        this.wifi_title = this.add.text(10, this.menu_height + 300, "", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        this.wifi_title1 = this.add.text(10, this.menu_height + 350, "", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        // 灰色の背景
        this.add.rectangle(5, this.menu_height + 290, 290, 48, 0xf0f0f0).setOrigin(0).setInteractive().setDepth(-1000)
        // 接続ボタン
        let connect = this.add.rectangle(180, this.menu_height + 294, 110, 40, 0xc0c0c0).setOrigin(0).setInteractive().setDepth(-1000)
        // 接続テキスト
        this.connect_text = this.add.text(205, this.menu_height + 296, "接続", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)

        this.wifis.forEach((wifi, i) => {
            // 灰色のボタン
            let wifiblock = this.add.rectangle(5, this.menu_height + i * 50, 290, 48, 0xf0f0f0).setOrigin(0).setInteractive().setDepth(-1000)
            // 濃いめの灰色背景
            this.add.rectangle(180, this.menu_height + 10 + i * 50, 110, 26, 0xc0c0c0).setOrigin(0).setDepth(-1000)

            //南京錠用アイコン
            if (wifi[2]) {
                // ロック
                this.add.sprite(195, this.menu_height + 23 + i * 50, 'padlock').setScale(0.08).setTint(0x00ffff);
            }
            else {
                // ロックなし
                this.add.sprite(195, this.menu_height + 23 + i * 50, 'padunlock').setScale(0.08).setTint(0x00ffff);
            }

            // 電波の柱
            let graphics = this.add.graphics();
            // 周囲の線
            this.border = graphics.strokeRect(20, this.menu_height + 30 + i * 50, 8, 10);
            this.border = graphics.strokeRect(29, this.menu_height + 20 + i * 50, 8, 20);
            this.border = graphics.strokeRect(38, this.menu_height + 10 + i * 50, 8, 30);
            // 柱
            graphics.fillStyle(0x4169e1, 1).fillRect(20, this.menu_height + 30 + i * 50, 8, 10);
            if (wifi[3] >= 2) {
                graphics.fillStyle(0x4169e1, 1).fillRect(29, this.menu_height + 20 + i * 50, 8, 20);
            }
            if (wifi[3] >= 3) {
                graphics.fillStyle(0x4169e1, 1).fillRect(38, this.menu_height + 10 + i * 50, 8, 30);
            }

            this.add.text(60, this.menu_height + 12 + i * 50, this.fix_wifi(wifi[0]), { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
            this.add.text(210, this.menu_height + 15 + i * 50, this.fix_wifi(wifi[1]), { color: "#555", font: "15px Yu Gothic" }).setOrigin(0)

            //上20pxと下&左右5pxくらいウィンドウが専有してるので基準を少しずらしてる
            wifiblock.on('pointerdown', () => {
                this.show_wifi(wifi)
                // this.desktop.Reportfunc("success")//結果送信テスト
            }, this);//最後にthis入れないとthisの参照先が変わってしまう

            //接続ボタンが押された時
            connect.on('pointerdown', () => {
                this.connect_wifi(wifi)
                this.desktop.Reportfunc({
                    type: "task",
                    status: "success",
                    task: {
                        id: 2,
                        "point": 150
                    }
                })//結果送信テスト
            }, this);//最後にthis入れないとthisの参照先が変わってしまう
        }, this);
    }
}