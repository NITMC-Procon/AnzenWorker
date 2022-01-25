
import { WindowManager } from "../System/Desktop.js";

export class Service{
    constructor() {
        this.parent = WindowManager

        if(WindowManager.services[this.constructor.name]) {
            this.creationFailed = true
            return
        }else{
            WindowManager.services[this.constructor.name] = this
        }

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