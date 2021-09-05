'use strict';
import { Window } from './Window.js';

export class Store extends Window {//ストアウィンドウ
    preload() {
        this.load.image('blackstar', 'images/star_black.png')
        this.load.image('whitestar', 'images/star_white.png')
        this.load.image('AntiVirusicon', 'images/apps/AntiVirus.png')
        this.title_text = "ストア"
        this.width = 800
        this.height = 540
        this.apps = this.get_apps()
        this.cond = 0
    }
    get_apps() {//アプリ一覧取得
        let apps = [
            ["AntiVirus", 3, "無料", "ウイルス対策ソフト\n誰にとっても使いやすくて信頼度も高い",
                "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック"],
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
    fix_dettext(app) {
        this.appname_text = app[0];
        this.corpname_text = app[0] + " Corp.";
        this.intro_text = app[3];
        this.price_text = app[2];
        this.func_text = app[4];
        this.auth_text = app[0] + "Corporation\n© " + app[0] + "Corporation"
    }

    create_after() {//create関数はすでにWindowクラスで使われてるので、そこからcreate_afterを呼び出してる
        // アプリ一覧表示画面
        let list = this.add.group();

        // ＜アプリ一覧＞
        this.top_text = this.add.text(50, this.menu_height + 15, "おすすめアプリ", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        list.add(this.top_text);

        this.apps.forEach((app, i) => {
            var n = i
            var dist = 0
            if (i >= 5) {
                dist = 220
                n -= 5
            }

            // アプリ背景
            let appblock = this.add.rectangle(30 + n * 150, 90 + dist, 140, 200, 0xf0f0f0).setOrigin(0).setInteractive().setDepth(-1000)
            list.add(appblock);
            // アプリ名
            this.appname = this.add.text(150 * n + 40, 210 + dist, this.fix_app(app[0]), { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
            list.add(this.appname);

            // アプリ評価（星の数）
            var j = 0;
            // 黒い星
            for (; j < app[1]; j++) {
                this.blackstar = this.add.sprite(150 * n + 50 + j * 18, 245 + dist, 'blackstar').setScale(0.08).setTint(0x00ffff);
                list.add(this.blackstar);
            }
            // 白い星
            for (; j < 5; j++) {
                this.whitestar = this.add.sprite(150 * n + 50 + j * 18, 245 + dist, 'whitestar').setScale(0.08).setTint(0x00ffff);
                list.add(this.whitestar);
            }

            // 値段
            this.pricetext = this.add.text(150 * n + 40, 260 + dist, this.fix_app(app[2]), { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
            list.add(this.pricetext);

            // アプリが選択された時
            appblock.on('pointerdown', () => {
                this.fix_dettext(app);
                list.setVisible(false);
                appdet.setVisible(true);

            }, this);//最後にthis入れないとthisの参照先が変わってしまう

        }, this);
        // アプリアイコン
        this.antivirusicon = this.add.sprite(100, 152, 'AntiVirusicon').setScale(1.15).setTint(0x00ffff)
        list.add(this.antivirusicon);

        //　個別アプリ詳細用グループ作成
        let appdet = this.add.group();

        //　背景
        this.detback1 = this.add.rectangle(4, 30, 792, 505, 0xf0f0f0).setOrigin(0)
        this.detback2 = this.add.rectangle(50, 50, 700, 250, 0xffffff).setOrigin(0)
        appdet.add(this.detback1);
        appdet.add(this.detback2);

        //　戻るボタン
        let backbtn = this.add.rectangle(3, 30, 47, 47, 0xc0c0c0).setOrigin(0).setInteractive()
        appdet.add(backbtn);

        // アプリアイコン
        this.appicon = this.add.sprite(150, 150, 'AntiVirusicon').setScale(1.5).setTint(0x00ffff)
        appdet.add(this.appicon);

        //　説明文
        this.appname_text = this.add.text(260, this.menu_height + 50, "AntiVirus", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        this.corpname_text = this.add.text(270, this.menu_height + 90, "Anti Virus Corp.", { color: "#00F", font: "15px Yu Gothic" }).setOrigin(0)
        this.intro_text = this.add.text(260, this.menu_height + 120, "ウイルス対策ソフト\n誰にとっても使いやすくて信頼度も高い", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
        this.price_text = this.add.text(260, this.menu_height + 190, "無料", { color: "#000", font: "25px Yu Gothic" }).setOrigin(0)
        this.dettopic_text = this.add.text(80, this.menu_height + 320, "対応プラットフォーム", { color: "#000", font: "25px Yu Gothic" }).setOrigin(0)
        this.dettopic2_text = this.add.text(470, this.menu_height + 320, "機能", { color: "#000", font: "25px Yu Gothic" }).setOrigin(0)
        this.dettopic3_text = this.add.text(80, this.menu_height + 410, "公開元・著作権", { color: "#000", font: "25px Yu Gothic" }).setOrigin(0)

        //this.blackstar = this.add.sprite(540 + j * 18, 270, 'blackstar').setScale(0.08).setTint(0x00ffff);

        appdet.add(this.appname_text);
        appdet.add(this.corpname_text);
        appdet.add(this.intro_text);
        appdet.add(this.price_text);
        appdet.add(this.dettopic_text);
        appdet.add(this.dettopic2_text);
        appdet.add(this.dettopic3_text);

        //　インストールボタン
        let installbtn = this.add.rectangle(260, 250, 150, 40, 0x33cccc).setOrigin(0).setInteractive()
        this.install_text = this.add.text(275, this.menu_height + 230, "インストール", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)

        appdet.add(installbtn);
        appdet.add(this.install_text);

        // 概要
        this.det_text = this.add.text(375, this.menu_height + 280, "概要", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
        this.platform_text = this.add.text(100, this.menu_height + 360, "PC", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
        this.func_text = this.add.text(420, this.menu_height + 360, "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック", { color: "#000", font: "24px Yu Gothic" }).setOrigin(0)
        this.auth_text = this.add.text(80, this.menu_height + 450, "Anti Virus Corporation\n© Anti Virus Corp", { color: "#00F", font: "20px Yu Gothic" }).setOrigin(0)

        appdet.add(this.det_text);
        appdet.add(this.platform_text);
        appdet.add(this.func_text);
        appdet.add(this.auth_text);

        // アプリが選択された時
        backbtn.on('pointerdown', () => {
            appdet.setVisible(false);
            list.setVisible(true);

        }, this);//最後にthis入れないとthisの参照先が変わってしまう

        appdet.setVisible(false);
    }
}
