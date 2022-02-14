const notifyarea = document.getElementById("notification_area")

// 構文
// Notify(text message,[option])

// 例
// Notify("message",{
//     callback: (args)=>{alert(args)},
//     style: "background-color: white; color: red;"
//   })

/** 
 * @typedef  {Object} Config - 通知用コンフィグ
 * @property {!Function=} callback - クリック時に実行される関数
 * @property {!String=} style - 通知に適用されるスタイル
 */

/**
    @param {String} text HTML
    @param {!Config=} option コンフィグ
    @return {Element} 通知のエレメント
*/
export function Notify(text,option){
    let style=""
    if(option && option.style) style=option.style
    let notifytext = createElementFromHTML(`<div class="notification" style="${style}"><p>${text}</p></div>`)

    let notifyelem = notifyarea.insertAdjacentElement('afterbegin',notifytext)
    const clickfunc = () =>{
        notifyelem.classList.remove("show")
        setTimeout(()=>{
            notifyelem.remove()
        },600)
        if(option && typeof option.callback == 'function') option.callback();
    }
    setTimeout(()=>{
        notifyelem.classList.add("show")
    },100)
    setTimeout(clickfunc,8000)

    notifyelem.addEventListener('click',clickfunc)
    
    return notifyelem
}

function createElementFromHTML(html){
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild;
}