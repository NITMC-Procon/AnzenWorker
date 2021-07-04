'use strict';
var express = require('express')//サーバー
var http = require('http')

require('./server/ws_server.js')//Websocketのサーバーを呼び出してる

var app = express()
app.use("/", express.static('client'))//clientを返す

var httpServer = http.createServer(app)

// サーバーの起動
httpServer.listen(80, () => {
    console.log('listening on 80')
})