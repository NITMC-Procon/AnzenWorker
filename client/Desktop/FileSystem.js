
class Item{
    /** 
     * @param {Folder} parent
     * @param {String} name
     * @param {Boolean} isdir
     */
    constructor(parent,name,isdir){
        this.parent = parent
        this.isdir = isdir
        this.name = name//名前変えるときはRename()して
        this.icon = ""
        
        if(parent !== null){
            if(!name) return
            if(parent.isdir)parent.children.set(name,this)
        }
        this.Root()
    }
    Rename(newname){
        this.parent.MoveFile(this.name,newname,null)
        this.name = newname
    }
    Pwd(){
        /** @type {Item} */
        let par = this
        let path = []
        if(this.parent == null) return "/"
        while(par.parent !== null){
            let tmp = "/"+ par.name
            path.push(tmp)
            par = par.parent
        }
        path = path.reverse()

        let pathstr = ""
        path.forEach(key=>{
            pathstr += key
        })
        if(this.isdir) pathstr += "/"
        return pathstr
    }
    Root(){
        /** @type {Item} */
        let parent = this
        if(this.root != null) return this.root
        while(parent.parent !== null){
            parent = parent.parent
        }
        /** @type {Folder} *///@ts-ignore
        this.root = parent
        return this.root
    }
    Open(){
    }
}

export class File extends Item{
    /** 
     * @param {Folder} parent
     * @param {String} name
     */
    constructor(parent,name){
        super(parent,name,false)
        this.content = null
    }
    Open(){
        if(typeof this.content == "function"){
            this.content()
        }else{
            console.log("File isn't executable")
        }
    }
}
export class Link extends Item{
    /** 
     * @param {Folder} parent
     * @param {String} name
     * @param {Item} target
     */
    constructor(parent,name,target){
        super(parent,name,false)
        this.target = target
    }
    Open(){
        if(this.target !== null)this.target.Open()
    }
}

export class Folder extends Item{
    /** 
     * @param {Folder} parent
     * @param {String} name
     */
    constructor(parent,name){
        super(parent,name,true)
        /** @type {Map.<String,Item>} */
        this.children = new Map()
        this.icon = "/images/folder.svg"
    }
    Mkdir(name){
        return new Folder(this,name)
    }
    Touch(name){
        return new File(this,name)
    }
    /** @param {String} name */
    NewItem(name){
        /** @type {Folder} */
        let parent = this
        if(name.match(/^(\/)/)){//先頭に/
            name = name.replace(/^(\/)/,"");
            parent = this.Root()
        }
        let isdir = false//末尾に/
        if(name.match(/(\/)$/)){//先頭に./
            name = name.replace(/(\/)$/,"");
            isdir = true
        }
        let items = name.split("/")
        let lastitem = items.pop()//末尾だけ除く
        items.forEach(dirname => {
            new Folder(parent,dirname)
            //@ts-ignore
            parent = parent.children.get(dirname)
        });
        let item
        if(isdir){
            item = new Folder(parent,lastitem)
        }else{
            item = new File(parent,lastitem)
        }
        return item
    }
    /** /Folder/Item みたいな
     * @param {String} path */
    GetPath(path){
        /** @type {Folder} */
        let parent = this
        /** @type {Item} */
        let item = null

        if(path == "/")return this.root
        if(path.match(/^\//)){//先頭に/
            path = path.replace(/^\//,"")
            parent = this.Root()
        }
        if(path.match(/^\.\//)){//先頭に./
            path = path.replace(/^\.\//,"")
            parent = this
        }
        path = path.replace(/\/$/,"");//末尾の/削除

        let keys = path.split("/")
        keys.forEach(key=>{
            item = parent.children.get(key)
            if(typeof item == "undefined")return null
            //@ts-ignore
            parent = item
        })
        return item
    }
    MoveFile(name,newname,newparent){
        if(newparent.isdir){//ディレクトリなら
            if(this.children.has(name)){//指定した名前があれば
                if(newparent == null){//child内で移動
                    newparent = this
                }
                if(!newparent.children.has(newname)){
                    let item = this.children.get(name)
                    item.name = newname
                    newparent.children.set(newname,item)
                    this.children.delete(name)
                }
            }else{
                return -1
            }
        }else{
            return -1
        }
    }
}

export const Root = new Folder(null,"root")