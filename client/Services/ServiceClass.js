
/**
 * @typedef  {Object} Parent - 親要素指定用コンフィグ
 * @property {Object} services - サービスのリスト
 * @property {Array<import('../Desktop/Window.js').Window>} windows - ウィンドウのリスト
 */

export class Service{
    /** @param {Parent} parent - 親要素指定用コンフィグ */
    constructor(parent) {
        this.parent = parent
        this.create()
    }
    destuctor(){
        if (this.parent.services[this.constructor.name]){
            delete this.parent.services[this.constructor.name]
        }
        this.destroy()
    }
    create(){}
    destroy(){}
}