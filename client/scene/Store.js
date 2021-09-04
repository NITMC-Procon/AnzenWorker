'use strict';
import { Window } from './Window.js';

export class Store extends Window {//ストアウィンドウ
    preload() {
        this.load.image('blackstar', 'images/star_black.png')
        this.load.image('whitestar', 'images/star_white.png')
        this.load.image('AntiVirusicon', 'images/apps/AntiVirus.png')
        this.title_text = "ストア"
        this.width = 800
        this.height = 600
        this.apps = this.get_apps()
        this.cond = 0
    }
    get_apps() {//アプリ一覧取得
        let apps = [
            ["AntiVirus", 3, "無料"],
            ["app2", 4, "￥3,900"],
            ["app3", 1, "無料"],
            ["app4", 2, "無料"],
            ["app5", 5, "無料"],
            ["app6", 5, "無料"],
            ["app7", 5, "無料"],
            ["app8", 5, "無料"],
            ["app9", 5, "無料"],
            ["app10", 5, "無料"]
        ]
        return apps
    }
    fix_app(text) {
        return text
    }

    create_after() {//create関数はすでにWindowクラスで使われてるので、そこからcreate_afterを呼び出してる
        this.top_text = this.add.text(50, this.menu_height + 15, "おすすめアプリ", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        this.apps.forEach((app, i) => {
            var n = i
            var dist = 0
            if (i >= 5) {
                dist = 250
                n -= 5
            }

            // アプリ背景
            let appblock = this.add.rectangle(30 + n * 150, 90 + dist, 140, 230, 0xf0f0f0).setOrigin(0).setInteractive().setDepth(-1000)
            // アプリ名
            this.add.text(150 * n + 40, 210 + dist, this.fix_app(app[0]), { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)

            // アプリ評価（星の数）
            var j = 0;
            for (; j < app[1]; j++) {
                this.add.sprite(150 * n + 50 + j * 18, 245 + dist, 'blackstar').setScale(0.08).setTint(0x00ffff);
            }
            for (; j < 5; j++) {
                this.add.sprite(150 * n + 50 + j * 18, 245 + dist, 'whitestar').setScale(0.08).setTint(0x00ffff);
            }

            // 値段
            this.add.text(150 * n + 40, 260 + dist, this.fix_app(app[2]), { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)

            // インストールボタン
            let installbtn = this.add.rectangle(150 * n + 40, 291 + dist, 120, 20, 0x33cccc).setOrigin(0).setInteractive().setDepth(-1000)
            this.install_text = this.add.text(150 * n + 40, 290 + dist, "インストール", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)

            // アプリが選択された時
            appblock.on('pointerdown', () => {


            }, this);//最後にthis入れないとthisの参照先が変わってしまう

            // アプリアイコン
            this.add.sprite(100, 152, 'AntiVirusicon').setScale(1.15).setTint(0x00ffff)

        }, this);
    }
}
