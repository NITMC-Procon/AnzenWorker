'use strict';

export class VirusEvent extends Phaser.Scene {//Phaser.Sceneを継承してウィンドウを自作 http://labs.phaser.io/edit.html?src=src\scenes\drag%20scenes%20demo.js 参照

    constructor(handle, parent, desktop)//thisに色々入れて使えるようにしてる
    {
        super(handle);
        this.handle = handle
        this.parent = parent;
        this.width = desktop.scale.width
        this.height = desktop.scale.height
        this.title_text = "Virus"
        this.desktop = desktop
        this.menu_height = 30
    }

    create()//ここでウィンドウ作る
    {
        this.scene.bringToTop(this);
        this.input.enabled = true
        this.parent.setDepth(2)
        this.cameras.main.setBackgroundColor(0xff0000)
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.width, this.height);//描画領域

        this.paybutton = this.addbutton(100,60,"PAY", () => {this.paybutton.clear(true,true)}).setXY(this.width * 0.7, this.height * 0.7).setOrigin(0.5)
        this.resetbutton = this.addbutton(120,60,"RESET", () => {this.reboot()}).setXY(this.width * 0.3, this.height * 0.7).setOrigin(0.5)

        this.text = this.add.text(this.width * 0.5, this.height * 0.5, 'Your computer has been hacked by Maizuru Ware!!\nYou need to pay 2.0 bitcoin to us.', { color: "#000", font: "20px Yu Gothic", align: "center", wordWrap: { width: this.width * 0.5, useAdvancedWrap: true } }).setOrigin(0.5)

        this.parent.setSize(this.width, this.height)
    }
    addbutton(w,h,text,func){
        let btngroup = this.add.group();
        let btn = this.add.rectangle(0, 0, w, h, 0xaaaaaa).setOrigin(0).setInteractive()
        let txt = this.add.text(0, 0, text, { color: "#000", font: "30px Yu Gothic" }).setOrigin(0.5)
        btngroup.add(btn)
        btngroup.add(txt)
        btngroup.setOrigin(0.5)
        btn.on('pointerdown', () => {
            func()
        }, this);
        return btngroup
    }
    reboot() {
        this.cameras.main.setBackgroundColor(0x000)
        this.paybutton.clear(true,true)//removeFromScene,destroyChild
        this.resetbutton.clear(true,true)
        var timer = this.time.delayedCall(5000, () => {
            Object.values(this.desktop.windows).forEach(e => {
                this.desktop.DestroyWindow(e)
            });
        }, null, this);
    }
}