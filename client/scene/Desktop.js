'use strict';
import { Mail } from './mail.js';

export class Desktop extends Phaser.Scene {//ゲームマネージャー兼デスクトップ画面
    constructor() {
        super({ key: 'Desktop' });
        this.count = 0;
        this.windows = {}//ここに{mail: ~,~}みたいな感じでウィンドウのリストが入る
        this.configs = {}//ここに接続先Wi-Fiとか侵入したウイルスとかの情報を入れていく予定
    }

    preload() {//preloadに画像とか読み込ませる create()よりも優先して実行される
        this.load.svg('logo', 'images/logo.svg');
        this.load.svg('background', 'images/background.svg', { scale: 1.5 });
        this.load.image('mailicon', 'images/mailicon.png')//メール用ロゴ
    }


    create() {
        this.cameras.main.setBackgroundColor(0x0080d0)//背景色(今は背景画像あるのでいらない フォールバック用?)
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setOrigin(0.5, 0.5)//背景
        this.resizebg(this.scale.width, this.scale.height)//背景サイズ調整
        this.taskbar = this.add.rectangle(0, this.scale.height - 30, this.scale.width, 30, 0x1c1c1c).setOrigin(0);//タスクバー作成

        //メール用アイコン登録
        let mailicon = this.add.sprite(80, 60, 'mailicon').setScale(0.5).setTint(0x00ffff).setInteractive();//setInteractiveしないとクリックできない!
        this.add.text(80, 120, "メール").setOrigin(0.5);//OriginのX座標を中心にしてテキストを中央合わせ

        mailicon.on('pointerdown', () => {//メールアイコンをクリックで
            this.CreateWindow(Mail);//mailクラスのウィンドウを作成
        }, this);//最後にthis入れないとthisの参照先が変わってしまう
        this.scale.on('resize', this.resize, this);//画面リサイズ時にresize関数を呼ぶ
        this.Connect_to_server('ws://127.0.0.1:8000')
    }
    Connect_to_server(server){
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
            console.log(json)
        }
    }
    CreateWindow(func)//新しい窓を作る関数
    {
        let x = Phaser.Math.Between(0, 300);//ランダムな値を返す
        let y = Phaser.Math.Between(0, 300);
        let handle = 'window' + this.count++;//ウィンドウの識別IDを作る

        let winzone = this.add.zone(x, y, 10, 10).setInteractive().setOrigin(0);//クリック用ゾーン作成 実際のクリックの設定はWindowクラスの中で行う
        let window = new func(handle, winzone, this);//Windowクラスを継承したfuncクラスのインスタンスを作成する
        this.input.setDraggable(winzone);//先程のゾーンをドラッグ出来るようにする
        this.scene.add(handle, window, true);//インスタンスをシーンに追加する

        if (this.windows[window.title_text] != undefined) {//すでに同じ名前のウィンドウがあれば
            window.scene.remove(window.handle)//自分削除
            window.parent.destroy()//親(クリック用Zone)削除
            this.windows[window.title_text].refresh()
        } else {
            this.windows[window.title_text] = window//自分のウィンドウを登録
        }
    }
    DestroyWindow(window) {//ウィンドウ削除用関数
        console.log(window.title_text)
        this.windows[window.title_text] = undefined//登録済みウィンドウから削除
        window.scene.remove(window.handle)//自分削除
        window.parent.destroy()//親(クリック用Zone)削除
    }
    update() {
    }
    resize(gameSize, baseSize, displaySize, resolution) {//画面リサイズ時
        let width = displaySize.width;
        let height = displaySize.height;

        this.resizebg(width, height)

        this.cameras.resize(width, height);//カメラ(描画領域)のサイズ合わせ

        this.taskbar.setPosition(0, height - 30);//タスクバーの位置合わせ
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
        console.log(data)
        this.sock.send(JSON.stringify(data))
    }
}