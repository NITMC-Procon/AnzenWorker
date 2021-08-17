'use strict';

/*この定義方法気持ち悪い（個人的に）*/
exports.startSocketServer = function(httpServer){
    const io = require('socket.io')(httpServer);

    /* Serverはconnectじゃなくてconnectionらしい*/
    io.on("connection", socket => {
        doConnect();
    io.on("a", (message) => {
        doMessage(message);
    });
    });


}

//TODO: 関数名変える(doはないぞー)
function doConnect(socket){
    //socket["id"] = generateUuid();
    console.log("Client connect")
}

function doMessage(message){
        console.log(message);
        console.log('you have message');
/*        try{
            var json = JSON.parse(message.toString());
            if(json.task.broadcast != null){
                json.task.broadcast.forEach(event => {
                    io.client.forEach(event => {
                        
                    });
                });
            }
        }catch (e) {
            console.log('デス');
        }*/
}

function generateUuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}
