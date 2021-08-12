'use strict';
import { Mail } from './Mail.js';
import { Wifi } from './Wifi.js';
import { JobManager } from './JobManager.js';

var host = window.document.location.host.replace(/:.*/, '');
var ServerAddress = 'ws://' + host + ':8000'

export class Desktop extends Phaser.Scene {//ゲームマネージャー兼デスクトップ画面
    constructor() {
        super({ key: 'Desktop' });
        this.count = 0;
        this.jobnum = -1;//ジョブ管理から起動するウィンドウの番号
        this.windows = {}//ここに{mail: ~,~}みたいな感じでウィンドウのリストが入る
        this.Configs = {}//ここに接続先Wi-Fiとか侵入したウイルスとかの情報を入れていく予定
    }

    preload() {//preloadに画像とか読み込ませる create()よりも優先して実行される
        this.load.svg('logo', 'images/logo.svg');
        this.load.svg('background', 'images/background.svg', { scale: 1.5 });
        this.load.image('mailicon', 'images/mailicon.png')//メール用ロゴ
        this.load.image('wifiicon', 'images/wifiicon.png')//Wi-Fi用ロゴ
        this.load.image("padlock", "images/padlock.png")//南京錠ロックロゴ
        this.load.image("padunlock", "images/padunlock.png")//南京錠アンロックロゴ
        this.load.image("jobManagericon", "images/jobManagericon.png")//ジョブ管理ロゴ
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0080d0)//背景色(今は背景画像あるのでいらない フォールバック用?)
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setOrigin(0.5, 0.5)//背景
        this.resizebg(this.scale.width, this.scale.height)//背景サイズ調整
        this.taskbar = this.add.rectangle(0, this.scale.height - 30, this.scale.width, 30, 0x1c1c1c).setOrigin(0);//タスクバー作成

        //メール用アイコン登録
        let mailicon = this.add.sprite(80, 60, 'mailicon').setScale(0.5).setTint(0x00ffff).setInteractive();//setInteractiveしないとクリックできない!
        this.add.text(80, 120, "メール").setOrigin(0.5);//OriginのX座標を中心にしてテキストを中央合わせ

        // Wi-Fi用アイコン登録
        this.wifiicon = this.add.sprite(this.scale.width - 25, this.scale.height - 15, 'wifiicon').setScale(0.05).setInteractive();//setInteractiveしないとクリックできない!

        // ジョブ管理アイコン登録
        let jobManagericon = this.add.sprite(80, 200, 'jobManagericon').setScale(0.2).setTint(0x00ffff).setInteractive();
        this.add.text(80, 270, "ジョブ管理").setOrigin(0.5);//OriginのX座標を中心にしてテキストを中央合わせ

        mailicon.on('pointerdown', () => {//メールアイコンをクリックで
            this.CreateWindow(Mail);//mailクラスのウィンドウを作成
        }, this);//最後にthis入れないとthisの参照先が変わってしまう

        this.wifiicon.on('pointerdown', () => {//Wi-Fiアイコンをクリックで
            this.CreateWindow(Wifi);//wi-fiクラスのウィンドウを作成
        }, this);//最後にthis入れないとthisの参照先が変わってしまう

        jobManagericon.on('pointerdown', () => {//スタートアイコンをクリックで
            this.CreateWindow(JobManager);//JobManagerクラスのウィンドウを作成
        }, this);//最後にthis入れないとthisの参照先が変わってしまう

        this.scale.on('resize', this.resize, this);//画面リサイズ時にresize関数を呼ぶ
        this.Connect_to_server(ServerAddress)//サーバーに接続
    }
    CreateWindow(func, x = null, y = null)//新しい窓を作る関数
    {
        x = x == null ? Phaser.Math.Between(0, 300) : x;//ランダムな値を返す
        y = y == null ? Phaser.Math.Between(0, 300) : y;
        let handle = 'window' + this.count++;//ウィンドウの識別IDを作る

        let winzone = this.add.zone(x, y, 10, 10).setInteractive().setOrigin(0);//クリック用ゾーン作成 実際のクリックの設定はWindowクラスの中で行う
        let window = new func(handle, winzone, this);//Windowクラスを継承したfuncクラスのインスタンスを作成する
        this.input.setDraggable(winzone);//先程のゾーンをドラッグ出来るようにする
        this.scene.add(handle, window, true);//インスタンスをシーンに追加する

        if (this.windows[window.title_text] != undefined) {//すでに同じ名前のウィンドウがあれば
            window.scene.remove(window.handle)//自分削除
            window.parent.destroy()//親(クリック用Zone)削除
            typeof this.windows[window.title_text].refresh == 'function' ? this.windows[window.title_text].refresh() : null;
        } else {
            this.windows[window.title_text] = window//自分のウィンドウを登録
            Object.values(this.windows).forEach(e => {
                e.input.enabled = false
            });
            window.input.enabled = true
            window.parent.setDepth(1)
        }
    }
    DestroyWindow(window) {//ウィンドウ削除用関数
        delete this.windows[window.title_text]//登録済みウィンドウから削除
        window.scene.remove(window.handle)//自分削除
        window.parent.destroy()//親(クリック用Zone)削除
    }
    Connect_to_server(server) {
        this.sock = new WebSocket(server)
        // websocket イベント
        // 接続した
        this.sock.onopen = (e) => {
            console.log('Socket接続に成功しました');
        }
        // エラーが発生した
        this.sock.onerror = (err) => {
            console.log(`Socketエラーが発生しました：${err}`);
        }
        // ソケットが閉じた
        this.sock.onclose = (e) => {
            console.log(`Socketが閉じられました`);
        }
        // サーバーからデータを受け取った
        this.sock.onmessage = (e) => {
            var json = JSON.parse(e.data)
            this.event_handler(json)
        }
    }
    resize(gameSize, baseSize, displaySize, resolution) {//画面リサイズ時
        let width = displaySize.width;
        let height = displaySize.height;

        this.resizebg(width, height)

        this.cameras.resize(width, height);//カメラ(描画領域)のサイズ合わせ

        this.taskbar.setPosition(0, height - 30);//タスクバーの位置合わせ
        this.wifiicon.setPosition(this.scale.width - 25, this.scale.height - 15);
        this.taskbar.setSize(width, 30);//タスクバーのサイズ合わせ
    }
    resizebg(width, height) {//背景リサイズ用(要らんかも)
        let img_width = this.background.width
        let img_height = this.background.height

        let disp_raito = width / img_width
        let img_raito = height / img_height
        if (disp_raito > img_raito) {
            this.background.setScale(disp_raito + 0.01)
        } else {
            this.background.setScale(img_raito + 0.01)
        }
        this.background.setPosition(width / 2, height / 2)
        this.background.updateDisplayOrigin()
    }
    Reportfunc(data) {//結果送信用関数
        this.sock.send(JSON.stringify(data))
    }
    event_handler(json) {//イベントハンドラ
        switch (json.type) {
            case "attack": {
                console.log("Someone is attacking!!!")
                //Call some function
                break;
            }
        }
    }
}