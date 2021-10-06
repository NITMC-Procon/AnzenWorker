'use strict';

const Classes = require("./Game.js")
const port = 8080

// Default ip addr and port
// CAUTION: IP address Only
const redisIP = "127.0.0.1"; 
const redisPort = "6379";

const http = require('http');
const express = require('express');//サーバー

const app = express();
app.use("/", express.static('client'));//clientを返す

const httpServer = http.createServer(app);
//const redisServer = {hostname: "localhost", port: 6379};

let Games = new Classes.Games({server:httpServer, port: port, redisIP: redisIP, redisPort: redisPort});

//httpServer.listen(port, () => {
//    console.log(`listening on ${port}`)
//})
