
import { WindowManager } from "../Desktop/Desktop.js";

export class Service{
    constructor() {
        this.parent = WindowManager
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