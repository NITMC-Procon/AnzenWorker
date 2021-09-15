'use strict';
import { Mail } from './Mail.js';
import { JobManager } from './JobManager.js';
import { VirusEvent } from './VirusEvent.js';
import { Store } from './Store.js';
import { CallWindow } from '../Desktop/Desktop.js'
import { Socket } from '../Functions/socket.js'

//ゲームマネージャー兼デスクトップ画面
export class Desktop extends Phaser.Scene {
    constructor() {
        super({ key: 'Desktop' });
        this.count = 0;
        this.windows = {}//ここに{mail: ~,~}みたいな感じでウィンドウのリストが入る
        //ここに接続先Wi-Fiとか侵入したウイルスとかの情報を入れていく予定
        this.Configs =
        {
            connected_wifi: [],
            completed_task: [],
            installed_software: [],      // アプリストアから入れたソフト
        }
    }

    preload() {//preloadに画像とか読み込ませる create()よりも優先して実行される
        this.load.svg('logo', 'images/logo.svg');
        this.load.svg('background', 'images/background.svg', { scale: 1.5 });
        this.load.image('mailicon', 'images/mailicon.png')//メール用ロゴ
        this.load.image('wifiicon', 'images/wifiicon.png')//Wi-Fi用ロゴ
        this.load.image("padlock", "images/padlock.png")//南京錠ロックロゴ
        this.load.image("padunlock", "images/padunlock.png")//南京錠アンロックロゴ
        this.load.image("jobManagericon", "images/jobManagericon.png")//ジョブ管理ロゴ
        this.load.image("storeicon", "images/storeicon.png")//ストアロゴ
    }

    create() {
        this.cameras.main.setBackgroundColor(0x0080d0)//背景色(今は背景画像あるのでいらない フォールバック用?)
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setOrigin(0.5, 0.5)//背景
        this.resizebg(this.scale.width, this.scale.height)//背景サイズ調整
        this.taskbar = this.add.rectangle(0, this.scale.height - 30, this.scale.width, 30, 0x1c1c1c).setOrigin(0);//タスクバー作成

        this.scale.on('resize', this.resize, this);//画面リサイズ時にresize関数を呼ぶ
    }

    //新しい窓を作る関数
    CreateWindow(func, x = null, y = null) {
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

    //ウィンドウ削除用関数
    DestroyWindow(window) {
        delete this.windows[window.title_text]//登録済みウィンドウから削除
        window.scene.remove(window.handle)//自分削除
        window.parent.destroy()//親(クリック用Zone)削除
    }

    //画面リサイズ時
    resize(gameSize, baseSize, displaySize, resolution) {
        let width = displaySize.width;
        let height = displaySize.height;

        this.resizebg(width, height)

        this.cameras.resize(width, height);//カメラ(描画領域)のサイズ合わせ

        this.taskbar.setPosition(0, height - 30);//タスクバーの位置合わせ
        this.taskbar.setSize(width, 30);//タスクバーのサイズ合わせ
    }

    //背景リサイズ用(要らんかも)
    resizebg(width, height) {
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

    EmitResult(data) {
        Socket.emit("taskresult", JSON.stringify(data))
    }

    eventHandler(json) {
        switch (json.type) {
            case "attack": {
                console.log("Someone is attacking!!!")
                switch (json.attack.type) {
                    case "trojan": {
                        this.CreateWindow(VirusEvent, 0, 0)
                        break;
                    }
                }
                break;
            }
        }
    }
    Task_Complete(task) {
        this.Configs.completed_task.push(task)
    }
    Task_IsCompleted(task) {
        let res = this.Configs.completed_task.findIndex(t => t === task)
        return (res === -1) ? false : true
    }
}
