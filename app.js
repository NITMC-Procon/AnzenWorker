'use strict';
const express = require('express');//サーバー
const http = require('http');
const wsServer = require('./server/ws_server.js');
const port = 8080

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
httpServer.listen(port, () => {
    console.log(`listening on ${port}`)
})
