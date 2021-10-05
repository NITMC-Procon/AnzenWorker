/**
 * @param {HTMLElement} target
 * @param {HTMLElement} elem
 */
export function AddContextMenu(target,elem){
    target.oncontextmenu = (e) => {
        e.stopPropagation()
        e.preventDefault()
        let menu = createElementFromHTML(`<div id="contextmenu"></div>`)
        menu.insertAdjacentElement("beforeend",elem)
        
        const desktop = document.getElementById("desktop")
        const selectother = (e) => {
            if(e.target.closest('#contextmenu') != menu){
                RemoveContextMenu()
                document.removeEventListener('mousedown', selectother)
            }
        }
        document.addEventListener('mousedown', selectother)

        menu.addEventListener("mousedown",(e)=>{
            e.stopPropagation()
        })
        menu.addEventListener("click",(e)=>{
            e.stopPropagation()
            RemoveContextMenu()
            document.removeEventListener('mousedown', selectother)
        })

        menu.style.left=e.pageX+"px";
        menu.style.top=e.pageY+"px";
        desktop.insertAdjacentElement(`beforeend`,menu)
    }
}

export function RemoveContextMenu(){
    if(document.getElementById("contextmenu") != null)document.getElementById("contextmenu").remove()//他のメニュー削除
}

/** @returns {HTMLElement} */
export function createElementFromHTML(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    //@ts-ignore
    return template.content.firstElementChild;
}