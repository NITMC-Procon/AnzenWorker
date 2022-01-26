
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
    }
    destroy(){
        if (this.parent.services[this.constructor.name]){
            delete this.parent.services[this.constructor.name]
        }
        this.destuctor()
    }
    destuctor(){}
}