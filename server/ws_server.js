'use strict';

/*この定義方法気持ち悪い（個人的に）*/
exports.startSocketServer = function(httpServer){
    const io = require('socket.io')(httpServer, {serverClient: true});

    /* Serverはconnectじゃなくてconnectionらしい*/
    io.on("connection", socket => {
        console.log("socketid: "+socket.id);
       
        doConnect(socket);
        console.log("GenUUID: " + socket.id);

        socket.on("message", arg => {
            doMessage(socket, arg);
        });
    });
}

//TODO: 関数名変える(doはないぞー)
function doConnect(socket) {
    console.log("Client connect")

    socket.id = generateUuid();
    socket.emit('updateUUID', {id: socket.id});
}

function doMessage(socket, message){
        try{
            var json = JSON.parse(message.toString());

            if(json.task.broadcast == null)
                return;

            json.task.broadcast.forEach(event => {
                socket.broadcast.emit('broadcast', JSON.stringify(event));
            });

        }catch (e) {
            console.log('invalid json: ' + message);
            return;
        }
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
