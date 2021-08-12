'use strict';

export class Window extends Phaser.Scene {//Phaser.Sceneを継承してウィンドウを自作 http://labs.phaser.io/edit.html?src=src\scenes\drag%20scenes%20demo.js 参照

    constructor(handle, parent, desktop)//thisに色々入れて使えるようにしてる
    {
        super(handle);
        this.handle = handle
        this.parent = parent;
        this.width = 700
        this.height = 400
        this.title_text = ""
        this.desktop = desktop//送信とか別ウィンドウ作成とかにあると便利そうなので
        this.menu_height = 30
    }

    create()//ここでウィンドウ作る
    {
        this.input.enabled = false
        this.cameras.main.setBackgroundColor(0xffffff)
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.width, this.height);//描画領域

        //周囲の線を作る
        let graphics = this.add.graphics();
        graphics.lineStyle(5, 0x0101ff, 1);
        this.border = graphics.strokeRoundedRect(0, 0, this.width, this.height, 0);

        this.menubar = this.add.rectangle(0, 0, this.width, this.menu_height, 0x0101ff).setOrigin(0)//メニューバー、上20
        this.Xbutton = this.add.rectangle(this.width - 30, 0, 30, this.menu_height, 0xff0000).setOrigin(0)//Xボタン

        this.title = this.add.text(3, 30 / 2, this.title_text).setOrigin(0, 0.5)//タイトル文

        this.parent.on('drag', (pointer, dragX, dragY) => {
            if (pointer.y - dragY < this.menu_height) {//バーをドラッグで移動
                if (dragY > 0) {
                    this.parent.y = dragY;
                }
                this.parent.x = dragX;
                this.refresh()
            }
            // if (this.parent.x+this.parent.width-pointer.x < 10 && this.parent.y+this.parent.height-pointer.y < 10){//ウィンドウ右下ドラッグでサイズ変更
            //     if (pointer.x-this.parent.x > this.menuheight) this.width = pointer.x-this.parent.x;
            //     if (pointer.y-this.parent.y > this.menuheight) this.height = pointer.y-this.parent.y;
            //     this.resize()
            // }
        }, this);//最後にthis入れないとthisの参照先が変わってしまう
        this.parent.on('pointerdown', function (pointer, dragX, dragY, event) {
            this.scene.bringToTop(this);//とりあえず手前に持ってくる
            this.input.enabled = true
            if (pointer.y - this.parent.y < this.menu_height && this.parent.x + this.width - pointer.x < this.menu_height) {//バーの端っこでクリックしたら
                this.desktop.DestroyWindow(this)//親(クリック用Zone)削除
            }
        }, this);
        this.parent.on('pointerout', function (pointer, dragX, dragY, event) {//ポインタがウィンドウの外に出てる場合
            this.input.enabled = false//ウィンドウ内の入力は無効
            this.parent.setDepth(-1)//深さを奥側に
        }, this);
        this.parent.on('pointerover', function (pointer, dragX, dragY, event) {//ポインタがウィンドウの中にある場合
            this.input.enabled = true//ウィンドウ内の入力は有効
            this.parent.setDepth(1)//深さを手前側に
        }, this);
        this.parent.setSize(this.width, this.height)
        typeof this["create_after"] == 'function' ? this["create_after"]():null;
    }
    refresh() {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.width, this.height);

        this.scene.bringToTop(this);//一番手前に持ってくる
    }
    resize()//ウィンドウのリサイズ、今は消してる
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.width, this.height);
        this.cameras.main.setBackgroundColor(0xffffff)

        let graphics = this.add.graphics();
        graphics.lineStyle(5, 0x0101ff, 1);
        this.border.destroy()
        this.border = graphics.strokeRoundedRect(0, 0, this.width, this.height, 0);//周囲の線

        this.menubar.destroy()
        this.menubar = this.add.rectangle(0, 0, this.width, this.menu_height, 0x0101ff).setOrigin(0)//メニューバー
        this.Xbutton.destroy()
        this.Xbutton = this.add.rectangle(this.width - 30, 0, 30, this.menu_height, 0xff0000).setOrigin(0)//Xボタン
        this.title.setText(this.title_text).setOrigin(0, 0.5).setDepth(1)

        this.parent.setSize(this.width, this.height)//Zoneのリサイズ
        this.scene.bringToTop(this);//手前に持ってくる
    }
}