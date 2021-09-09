'use strict';
import { Window } from './Window.js';

export class Store extends Window {//ストアウィンドウ
    preload() {
        this.load.image('blackstar', 'images/star_black.png')
        this.load.image('whitestar', 'images/star_white.png')
        this.load.image('AntiVirusicon', "images/apps/AntiVirus.png")
        this.title_text = "ストア"
        this.width = 800
        this.height = 540
        this.apps = this.get_apps()
        this.select = -1                        // 選んだアプリを記憶
    }
    get_apps() {//アプリ一覧取得
        let apps = [
            ["AntiVirus", 4, "無料", "ウイルス対策ソフト\n誰にとっても使いやすくて信頼度も高い",
                "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック", "©Anti Virus Corporation"],
            ["EasyVirusScanner", 1, "無料", "Virusのすきゃんができる.\nすごく安心する.",
                "・Virusがみつかる.\n・コンピュータを防衛する", "不明"],
            ["app3", 1, "無料"],
            ["app4", 2, "無料"],
            ["AntiVirusPro", 3, "￥3,900", "ウイルス対策ソフト有料版\n誰にとっても使いやすくて信頼度も高い",
                "・ウイルスの定期スキャン\n・ウイルス検出時の除去\n・不審なソフトウェアのブロック", "©Anti Virus Corporation"],
            ["app6", 5, "無料"],
            ["app7", 5, "無料"],
            ["app8", 5, "無料"],
            ["app9", 5, "無料"],
            ["app10", 5, "無料"]
        ]
        return apps
    }
    // リスト画面でアプリ名表示
    fix_app(text) {
        text = text.replaceAll("\n", " ")
        text = text.substr(0, 12)
        return text
    }
    // アプリ詳細画面のテキスト変更
    fix_dettext(app, i) {
        this.appname_text.setText(app[0]);      // アプリ名
        this.corpname_text.setText(app[5]);     // 会社名
        this.intro_text.setText(app[3]);        // 簡単な説明
        this.price_text.setText(app[2]);        // 値段
        this.func_text.setText(app[4]);         // 機能
        this.auth_text.setText(app[5]);         // 著作権利者

        // アプリのアイコンを表示
        if (i == 0) {
            this.icon1.setVisible(true);
        }
        else if (i == 4) {
            this.icon1.setVisible(true);
        }

        //  インストール済みなら
        if (this.desktop.Configs.installed_software.includes(app[0])) {
            this.install_text.setText("アンインストール");
            this.installbtn.width = 190;
        }
        else {　// インストールしていなければ
            this.install_text.setText("インストール");
            this.installbtn.width = 150;
        }
    }

    create_after() {//create関数はすでにWindowクラスで使われてるので、そこからcreate_afterを呼び出してる
        // アプリ一覧表示画面
        let list = this.add.group();

        // ＜アプリ一覧＞
        this.top_text = this.add.text(50, this.menu_height + 15, "おすすめアプリ", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        list.add(this.top_text);

        // 6個目のアプリからは2行目に表示する
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
                // アプリ詳細画面のテキスト変更
                this.fix_dettext(app, i);
                // リスト画面を非表示
                list.setVisible(false);
                //　アプリ詳細画面を表示
                appdet.setVisible(true);
                //　洗濯されたアプリを記憶
                this.select = i;
            }, this);//最後にthis入れないとthisの参照先が変わってしまう

        }, this);

        // アプリアイコン
        this.antivirusicon = this.add.sprite(100, 152, "AntiVirusicon").setScale(1.15).setTint(0x00ffff)
        this.antivirusProicon = this.add.sprite(700, 152, "AntiVirusicon").setScale(1.15).setTint(0x00ffff)
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

        // アプリアイコン群
        this.appicons = this.add.group();
        this.icon1 = this.add.sprite(150, 150, 'AntiVirusicon').setScale(1.5).setTint(0x00ffff)

        this.appicons.add(this.icon1);

        this.appicons.setVisible(false);

        //　説明文
        this.appname_text = this.add.text(260, this.menu_height + 50, "", { color: "#000", font: "30px Yu Gothic" }).setOrigin(0)
        this.corpname_text = this.add.text(270, this.menu_height + 90, "", { color: "#00F", font: "15px Yu Gothic" }).setOrigin(0)
        this.intro_text = this.add.text(260, this.menu_height + 120, "", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
        this.price_text = this.add.text(260, this.menu_height + 190, "", { color: "#000", font: "25px Yu Gothic" }).setOrigin(0)
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
        this.installbtn = this.add.rectangle(260, 250, 150, 40, 0x33cccc).setOrigin(0).setInteractive()
        this.install_text = this.add.text(275, this.menu_height + 230, "インストール", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)

        appdet.add(this.installbtn);
        appdet.add(this.install_text);

        // 概要
        this.det_text = this.add.text(375, this.menu_height + 280, "概要", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
        this.platform_text = this.add.text(100, this.menu_height + 360, "PC", { color: "#000", font: "20px Yu Gothic" }).setOrigin(0)
        this.func_text = this.add.text(420, this.menu_height + 360, "", { color: "#000", font: "24px Yu Gothic" }).setOrigin(0)
        this.auth_text = this.add.text(80, this.menu_height + 450, "", { color: "#00F", font: "20px Yu Gothic" }).setOrigin(0)

        appdet.add(this.det_text);
        appdet.add(this.platform_text);
        appdet.add(this.func_text);
        appdet.add(this.auth_text);

        // 戻るボタンが押された時
        backbtn.on('pointerdown', () => {
            //　アプリ詳細画面を非表示
            appdet.setVisible(false);
            //　アプリのアイコンを非表示
            this.appicons.setVisible(false);
            //　アプリ一覧を表示
            list.setVisible(true);
            //　記憶したアプリをリセット
            this.select = -1;
        }, this);//最後にthis入れないとthisの参照先が変わってしまう

        // インストールボタンが押された時
        this.installbtn.on('pointerdown', () => {
            //　選択されたアプリ名を記憶
            var selectedapp = this.apps[this.select][0];

            //  インストール済みなら
            if (this.desktop.Configs.installed_software.includes(selectedapp)) {
                this.install_text.setText("インストール");
                this.installbtn.width = 150;

                //　保存されている配列の位置を検索
                var loc = this.desktop.Configs.installed_software.indexOf(selectedapp)

                //　Configのinstalled_softwareからアプリを削除
                this.desktop.Configs.installed_software.splice(loc, 1)
            }
            else {　// インストールしていなければ
                this.install_text.setText("アンインストール")
                this.installbtn.width = 190;

                //  Configのinstalled_softwareにアプリを追加
                this.desktop.Configs.installed_software.push(selectedapp)
            }
        }, this);//最後にthis入れないとthisの参照先が変わってしまう

        appdet.setVisible(false);
    }
}
