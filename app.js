'use strict';
const express = require('express');//サーバー
const http = require('http');
const wsServer = require('./server/ws_server.js');

const app = express();
app.use("/", express.static('client'));//clientを返す

const httpServer = http.createServer(app);
wsServer.startSocketServer(httpServer);

/*
 * サーバを起動
 * ポート
 *  80   : Default 
 *  8080 : Test (sudo npm startを回避するため) 
 */
httpServer.listen(8080, () => {
    console.log('listening on 80')
})
