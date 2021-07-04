'use strict';

var webSocket = require('ws')   //websocket

var wss = new webSocket.Server({ port: 8000 })  //オプションを{ server: httpServer }等にすると同じポートを共有できる。

wss.on('connection', socket => {
    socket.on('message', message => {
        wss.clients.forEach(client => {
            client.send('Hello, this message comes from server!\nyou sent ' + message);//テスト
        });
    });

    socket.on('close', () => {
        console.log('good bye.');
    });
});