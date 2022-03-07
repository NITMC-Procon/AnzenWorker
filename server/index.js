'use strict';

const Classes = require("./Game.js")

// サーバー
const http = require('http');
const express = require('express');

const app = express();
// clientを返す
app.use("/", express.static('client'));


/*=== Server Configuretion ===*/

/**
 * httpサーバ
 * @type {http.Server}
 * */
const httpServer = http.createServer(app);

/**
 * httpサーバのポート番号
 * @type {int}
 * */
const port = 8080

/**
 * RedisサーバのIP アドレス
 * @type {int}
 * */
const redisIP = "127.0.0.1"; 

/**
 * Redisサーバのポート番号
 * @type {int}
 * */
const redisPort = "6379";

/**
 * ルームIDの最大入力文字数  
 * 全角半角記号によらず、全て1文字とカウントされる
 * @type {int}
 * */
const maxRoomIdLength = 1024;

/**
 * ユーザ名の最大入力文字数  
 * 全角半角記号によらず、全て1文字とカウントされる
 * @type {int}
 * */
const maxUserNameLength = 1024;

const serverConfig = 
{
    server: httpServer,
    port: port,
    redisIP: redisIP,
    redisPort: redisPort,
    maxRoomIdLength: maxRoomIdLength,
    maxUserNameLength: maxUserNameLength
};

/*=== End Server Configuretion ===*/

// Start Game!
let Games = new Classes.Games(serverConfig);


//const httpServer = http.createServer(app);
//let Games = new Classes.Games({server:httpServer, port: port, redisIP: redisIP, redisPort: redisPort, maxRoomIdLength: maxRoomIdLength, maxUserNameLength: maxUserNameLength});

//httpServer.listen(port, () => {
//    console.log(`listening on ${port}`)
//})
